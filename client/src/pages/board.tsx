import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/sidebar";
import { BoardTable } from "@/components/board-table";
import { AddRequestModal } from "@/components/add-request-modal";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, Share2, Link, Bot, UserPlus, MoreHorizontal, Plus, Search, User, Filter, SortAsc, EyeOff, Layers, Maximize } from "lucide-react";

export default function Board() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [addRequestModalOpen, setAddRequestModalOpen] = useState(false);
  
  // Get the first workspace and board for demo
  const { data: workspaces } = useQuery({
    queryKey: ["/api/workspaces"],
  });

  const { data: boards } = useQuery({
    queryKey: ["/api/workspaces", workspaces?.[0]?.id, "boards"],
    enabled: !!workspaces?.[0]?.id,
  });

  const boardId = boards?.[0]?.id;
  const boardName = boards?.[0]?.name || "Creative MY OWN Channel";

  return (
    <div className="flex h-screen overflow-hidden bg-monday-bg">
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-semibold text-monday-text">{boardName}</h1>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" className="text-monday-text">
                  <Link className="w-4 h-4 mr-2" />
                  Integrate
                </Button>
                <Button variant="outline" size="sm" className="text-monday-text">
                  <Bot className="w-4 h-4 mr-2" />
                  Automate / 6
                </Button>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center -space-x-2">
                <div className="w-8 h-8 bg-monday-purple rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-medium">
                  JD
                </div>
                <div className="w-8 h-8 bg-monday-success rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-medium">
                  AM
                </div>
              </div>
              <Button className="bg-monday-blue hover:bg-blue-600 text-white" size="sm">
                <UserPlus className="w-4 h-4 mr-2" />
                Invite / 1
              </Button>
              <Button variant="ghost" size="sm" className="text-monday-text-muted">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Board Tabs */}
          <div className="mt-4 flex items-center space-x-6">
            <button className="flex items-center space-x-2 pb-2 border-b-2 border-monday-blue text-monday-blue">
              <i className="fas fa-th-large"></i>
              <span className="text-sm font-medium">Main table</span>
            </button>
            <button className="flex items-center space-x-2 pb-2 text-monday-text-secondary hover:text-monday-text transition-colors">
              <i className="fas fa-wpforms"></i>
              <span className="text-sm">Request Form</span>
            </button>
            <button className="flex items-center space-x-2 pb-2 text-monday-text-secondary hover:text-monday-text transition-colors">
              <i className="fas fa-columns"></i>
              <span className="text-sm">Kanban</span>
            </button>
            <button className="text-monday-text-muted hover:text-monday-text transition-colors">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Board Controls */}
        <div className="bg-white border-b border-gray-200 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                className="bg-monday-blue hover:bg-blue-600 text-white" 
                size="sm"
                onClick={() => setAddRequestModalOpen(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                New request
              </Button>
              <Button variant="outline" size="sm" className="text-monday-text">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
              
              <Button variant="outline" size="sm" className="text-monday-text">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm" className="text-monday-text">
                <SortAsc className="w-4 h-4 mr-2" />
                Sort
              </Button>
              
              <Button variant="outline" size="sm" className="text-monday-text">
                <Layers className="w-4 h-4 mr-2" />
                Group by
              </Button>
            </div>
            <Button variant="ghost" size="sm" className="text-monday-text-muted">
              <Maximize className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Main Board Content */}
        <div className="flex-1 overflow-y-auto bg-monday-bg">
          {boardId && <BoardTable boardId={boardId} />}
        </div>
      </div>

      <AddRequestModal 
        open={addRequestModalOpen}
        onOpenChange={setAddRequestModalOpen}
      />

      {/* Help Button */}
      <Button 
        className="fixed bottom-6 right-6 w-12 h-12 bg-monday-blue text-white rounded-full shadow-monday-hover hover:bg-blue-600 z-40"
        size="icon"
      >
        <i className="fas fa-question text-lg"></i>
      </Button>
    </div>
  );
}
