import ControlPanelHeader from '../components/ControlPanelHeader';
import MovementControls from '../components/MovementControls';
import RelativeMovement from '../components/RelativeMovement';
import Peripherals from '../components/Peripherals';
import CreatePointForm from '../components/CreatePointForm';
import StatusMessage from '../components/StatusMessage';

const FarmBotControlPanelPage = () => {
    return (
        <div className="container mx-auto p-4">
            <ControlPanelHeader />
            <MovementControls />
            <RelativeMovement />
            <Peripherals />
            <CreatePointForm />
            <StatusMessage />
        </div>
    );
};

export default FarmBotControlPanelPage;
