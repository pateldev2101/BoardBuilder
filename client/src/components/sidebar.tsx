import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight, ChevronLeft, Home, User, Star, Briefcase, Search } from "lucide-react";

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({ collapsed, onToggleCollapse }: SidebarProps) {
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const [workspacesOpen, setWorkspacesOpen] = useState(true);

  const { data: workspaces } = useQuery({
    queryKey: ["/api/workspaces"],
  });

  const currentWorkspace = workspaces?.[0];

  if (collapsed) {
    return (
      <div className="w-16 bg-white border-r border-gray-200 flex flex-col shadow-monday transition-all duration-300">
        <div className="p-4 border-b border-gray-200">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onToggleCollapse}
            className="w-8 h-8"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex-1 p-2">
          <nav className="space-y-2">
            <Button variant="ghost" size="icon" className="w-full">
              <Home className="w-5 h-5 text-monday-text-muted" />
            </Button>
            <Button variant="default" size="icon" className="w-full bg-monday-blue">
              <User className="w-5 h-5" />
            </Button>
          </nav>
        </div>
      </div>
    );
  }

  return (
    <div className="w-280 bg-white border-r border-gray-200 flex flex-col shadow-monday transition-all duration-300">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-200">
        {/* Workspace Dropdown */}
        <div className="mb-4">
          <Button 
            variant="ghost" 
            className="w-full justify-between p-2 hover:bg-gray-50 h-auto"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 monday-gradient rounded-lg flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-white" />
              </div>
              <div className="text-left">
                <div className="text-sm font-medium text-monday-text">
                  {currentWorkspace?.name || "Creative MY OWN Channel"}
                </div>
                <div className="text-xs text-monday-text-secondary">Main workspace</div>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-monday-text-muted" />
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-monday-text-muted" />
          <Input 
            type="text" 
            placeholder="Search" 
            className="w-full pl-10 border-gray-200 focus:ring-2 focus:ring-monday-blue focus:border-monday-blue"
          />
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto p-4">
        <nav className="space-y-2">
          <Button variant="ghost" className="w-full justify-start">
            <Home className="w-5 h-5 text-monday-text-muted mr-3" />
            <span className="text-sm text-monday-text">Home</span>
          </Button>
          <Button variant="default" className="w-full justify-start bg-monday-blue text-white">
            <User className="w-5 h-5 mr-3" />
            <span className="text-sm">My work</span>
          </Button>
        </nav>

        {/* Favorites Section */}
        <div className="mt-6">
          <Collapsible open={favoritesOpen} onOpenChange={setFavoritesOpen}>
            <CollapsibleTrigger asChild>
              <Button 
                variant="ghost" 
                className="w-full justify-start p-2 hover:bg-gray-50"
              >
                <div className="flex items-center space-x-3">
                  {favoritesOpen ? 
                    <ChevronDown className="w-3 h-3 text-monday-text-muted" /> :
                    <ChevronRight className="w-3 h-3 text-monday-text-muted" />
                  }
                  <Star className="w-5 h-5 text-monday-warning" />
                  <span className="text-sm font-medium text-monday-text">Favorites</span>
                </div>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="ml-6 mt-2 space-y-1">
              <Button variant="ghost" className="w-full justify-start p-2 text-sm text-monday-text-secondary hover:bg-gray-50">
                Quick Projects
              </Button>
              <Button variant="ghost" className="w-full justify-start p-2 text-sm text-monday-text-secondary hover:bg-gray-50">
                Team Tasks
              </Button>
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* Workspaces Section */}
        <div className="mt-4">
          <Collapsible open={workspacesOpen} onOpenChange={setWorkspacesOpen}>
            <CollapsibleTrigger asChild>
              <Button 
                variant="ghost" 
                className="w-full justify-start p-2 hover:bg-gray-50"
              >
                <div className="flex items-center space-x-3">
                  {workspacesOpen ? 
                    <ChevronDown className="w-3 h-3 text-monday-text-muted" /> :
                    <ChevronRight className="w-3 h-3 text-monday-text-muted" />
                  }
                  <Briefcase className="w-5 h-5 text-monday-blue" />
                  <span className="text-sm font-medium text-monday-text">Workspaces</span>
                </div>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="ml-6 mt-2 space-y-1">
              {workspaces?.map((workspace) => (
                <Button 
                  key={workspace.id}
                  variant="ghost" 
                  className={cn(
                    "w-full justify-start p-2 text-sm hover:bg-gray-50",
                    workspace.id === currentWorkspace?.id 
                      ? "font-medium text-monday-text" 
                      : "text-monday-text-secondary"
                  )}
                >
                  {workspace.name}
                </Button>
              ))}
              <Button variant="ghost" className="w-full justify-start p-2 text-sm text-monday-text-secondary hover:bg-gray-50">
                Marketing Team
              </Button>
              <Button variant="ghost" className="w-full justify-start p-2 text-sm text-monday-text-secondary hover:bg-gray-50">
                Development
              </Button>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>

      {/* Collapse Button */}
      <div className="p-4 border-t border-gray-200">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-monday-text-secondary hover:text-monday-text"
          onClick={onToggleCollapse}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          <span className="text-sm">Collapse</span>
        </Button>
      </div>
    </div>
  );
}
