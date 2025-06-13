import mqtt from 'mqtt';

export const connectToFarmBot = async (jwt, botId, email, mqttWsUrl, onMessageCallback) => {
    try {
        const mqttBroker = mqttWsUrl || 'wss://clever-octopus.rmq.cloudamqp.com:443/ws/mqtt';
        const clientId = `client-${Math.random().toString(16).slice(3)}`;
        console.log(`🔌 Connecting to MQTT with botId: ${botId}, JWT: ${jwt.slice(0, 10)}..., Broker: ${mqttBroker}`);

        const options = {
            clientId,
            username: botId,
            password: jwt,
            protocol: 'wss',
            rejectUnauthorized: false,
            keepalive: 60,
            reconnectPeriod: 10000,
            connectTimeout: 30000,
        };

        const client = mqtt.connect(mqttBroker, options);

        return new Promise((resolve, reject) => {
            let moveResponse = null;

            client.on('connect', () => {
                console.log('✅ Successfully connected to FarmBot MQTT broker');

                const statusTopic = `bot/${botId}/status`;
                const logsTopic = `bot/${botId}/logs`;
                const fromDeviceTopic = `bot/${botId}/from_device`;

                client.subscribe([statusTopic, logsTopic, fromDeviceTopic], (err) => {
                    if (err) {
                        console.error('�19 Failed to subscribe to topics:', err);
                        reject(new Error(`Failed to subscribe: ${err.message}`));
                    } else {
                        console.log(`📡 Subscribed to topics: ${statusTopic}, ${logsTopic}, ${fromDeviceTopic}`);
                        resolve(client);
                    }
                });
            });

            client.on('error', (err) => {
                console.error('�19 MQTT Error:', err);
                reject(new Error(`MQTT connection failed: ${err.message}`));
            });

            client.on('close', () => {
                console.log('🔌 MQTT connection closed');
            });

            client.on('offline', () => {
                console.log('📴 MQTT client offline');
            });

            client.on('message', (topic, message) => {
                try {
                    const payload = JSON.parse(message.toString());
                    console.log(`📥 MQTT Message on ${topic}:`, payload);
                    if (onMessageCallback) {
                        onMessageCallback(topic, payload);
                    }
                    if (topic === `bot/${botId}/from_device`) {
                        if (payload.kind === 'rpc_ok' && payload.args && payload.args.label === 'move_absolute') {
                            moveResponse = { success: true };
                        } else if (payload.kind === 'rpc_error' && payload.args && payload.args.label === 'move_absolute') {
                            moveResponse = { success: false, error: payload.body?.[0]?.message || 'Unknown error' };
                        }
                    }
                } catch (err) {
                    console.error('�19 Error processing MQTT message:', err);
                }
            });

            client.move = async (type, position, options = {}) => {
                const commandTopic = `bot/${botId}/from_clients`;
                let command;

                if (type === 'move_absolute') {
                    command = {
                        kind: 'rpc_request',
                        args: { label: 'move_absolute' },
                        body: [
                            {
                                kind: 'move_absolute',
                                args: {
                                    location: {
                                        kind: 'coordinate',
                                        args: { x: position.x, y: position.y, z: position.z },
                                    },
                                    offset: {
                                        kind: 'coordinate',
                                        args: { x: 0, y: 0, z: 0 },
                                    },
                                    speed: options.speed || 100,
                                },
                            },
                        ],
                    };
                } else {
                    throw new Error(`Unsupported move type: ${type}`);
                }

                return new Promise((resolve, reject) => {
                    moveResponse = null;

                    client.publish(commandTopic, JSON.stringify(command), { qos: 1 }, (err) => {
                        if (err) {
                            console.error('�19 Failed to send move command:', err);
                            reject(err);
                        } else {
                            console.log('🚜 Move command sent:', command);

                            const timeout = setTimeout(() => {
                                if (!moveResponse) {
                                    console.warn('⚠️ No response from bot within 5 seconds!');
                                    reject(new Error('Move command timed out'));
                                }
                            }, 5000);

                            const checkResponse = setInterval(() => {
                                if (moveResponse) {
                                    clearTimeout(timeout);
                                    clearInterval(checkResponse);
                                    if (moveResponse.success) {
                                        resolve(moveResponse);
                                    } else {
                                        reject(new Error(`Move failed: ${moveResponse.error || 'Unknown error'}`));
                                    }
                                }
                            }, 500);
                        }
                    });
                });
            };

            client.requestStatus = async () => {
                const commandTopic = `bot/${botId}/from_clients`;
                return new Promise((resolve, reject) => {
                    const label = `status_request_${Date.now()}`;

                    const command = {
                        kind: 'rpc_request',
                        args: { label },
                        body: [
                            {
                                kind: 'read_status',
                                args: {},
                            },
                        ],
                    };

                    const handler = (topic, payload) => {
                        if (
                            topic === `bot/${botId}/from_device` &&
                            payload.kind === 'status_update' &&
                            payload.location_data &&
                            payload.location_data.position
                        ) {
                            client.removeListener('message', messageHandler);
                            resolve(payload.location_data.position);
                        }
                    };

                    const messageHandler = (topic, message) => {
                        try {
                            const payload = JSON.parse(message.toString());
                            handler(topic, payload);
                        } catch (err) {
                            console.error("�19 Failed to parse status response", err);
                        }
                    };

                    client.on('message', messageHandler);

                    client.publish(commandTopic, JSON.stringify(command), { qos: 1 }, (err) => {
                        if (err) {
                            client.removeListener('message', messageHandler);
                            reject(err);
                        }
                    });

                    setTimeout(() => {
                        client.removeListener('message', messageHandler);
                        reject(new Error("Status request timed out"));
                    }, 5000);
                });
            };
        });
    } catch (err) {
        console.error('�19 Failed to connect to FarmBot:', err);
        throw err;
    }
};