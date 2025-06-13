import ControlPanelHeader from '../components/ControlPanelHeader';
import MoveCommandForm from '../components/MoveCommandForm';
import StatusMessage from '../components/StatusMessage';
import {useBot} from "@/BotContext.jsx";
const FarmBotControlPanelPage = () => {
    const bot = useBot();

    return (
        <div className="container mx-auto p-4">
            <ControlPanelHeader />
            <MoveCommandForm bot={bot} />
            <StatusMessage />
        </div>
    );
};

export default FarmBotControlPanelPage;