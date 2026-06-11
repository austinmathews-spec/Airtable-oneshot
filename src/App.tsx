import useStore from './store/useStore';
import TopBar from './components/TopBar';
import Sidebar from './components/Sidebar';
import TableTabs from './components/TableTabs';
import Toolbar from './components/Toolbar';
import Grid from './components/Grid';
import KanbanView from './components/KanbanView';
import CalendarView from './components/CalendarView';
import GalleryView from './components/GalleryView';
import FormView from './components/FormView';
import RecordDetail from './components/RecordDetail';
import AddFieldModal from './components/AddFieldModal';
import FilterPanel from './components/FilterPanel';
import SortPanel from './components/SortPanel';
import GroupPanel from './components/GroupPanel';
import HiddenFieldsPanel from './components/HiddenFieldsPanel';

export default function App() {
  const activeView = useStore(s => s.getActiveView());

  const renderView = () => {
    switch (activeView.type) {
      case 'kanban': return <KanbanView />;
      case 'calendar': return <CalendarView />;
      case 'gallery': return <GalleryView />;
      case 'form': return <FormView />;
      default: return <Grid />;
    }
  };

  return (
    <div className="h-full w-full flex flex-col bg-white">
      <TopBar />
      <TableTabs />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Toolbar />
          <FilterPanel />
          <SortPanel />
          <GroupPanel />
          <HiddenFieldsPanel />
          {renderView()}
        </div>
      </div>
      <RecordDetail />
      <AddFieldModal />
    </div>
  );
}
