import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { InlineEdit } from "./inline-edit";
import { StatusBadge } from "./ui/status-badge";
import { PriorityBadge } from "./ui/priority-badge";
import { AddRequestModal } from "./add-request-modal";
import { apiRequest } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";
import { ChevronDown, ChevronRight, Plus, MoreHorizontal } from "lucide-react";
import type { Group, Request, User } from "@shared/schema";

interface GroupSectionProps {
  group: Group;
  requests: Request[];
  users: User[];
}

export function GroupSection({ group, requests, users }: GroupSectionProps) {
  const [collapsed, setCollapsed] = useState(group.collapsed === "true");
  const [addRequestModalOpen, setAddRequestModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const updateRequestMutation = useMutation({
    mutationFn: async ({ requestId, updates }: { requestId: string; updates: Partial<Request> }) => {
      await apiRequest("PATCH", `/api/requests/${requestId}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/boards"] });
      toast({ title: "Request updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update request", variant: "destructive" });
    },
  });

  const handleRequestUpdate = (requestId: string, field: string, value: string) => {
    updateRequestMutation.mutate({
      requestId,
      updates: { [field]: value }
    });
  };

  const getUserById = (id: string | null) => {
    if (!id) return null;
    return users.find(user => user.id === id);
  };

  const getUserInitials = (user: User | null) => {
    if (!user) return "?";
    return user.initials || user.name.split(" ").map(n => n[0]).join("").toUpperCase();
  };

  const getBorderColor = () => {
    switch (group.color) {
      case "#3498db": return "border-blue-400";
      case "#9b59b6": return "border-purple-400";
      case "#27ae60": return "border-green-400";
      default: return "border-gray-400";
    }
  };

  const getBackgroundColor = () => {
    switch (group.color) {
      case "#3498db": return "bg-blue-50";
      case "#9b59b6": return "bg-purple-50";
      case "#27ae60": return "bg-green-50";
      default: return "bg-gray-50";
    }
  };

  const getBadgeColor = () => {
    switch (group.color) {
      case "#3498db": return "bg-blue-100 text-blue-700";
      case "#9b59b6": return "bg-purple-100 text-purple-700";
      case "#27ae60": return "bg-green-100 text-green-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-monday overflow-hidden">
      <Collapsible open={!collapsed} onOpenChange={(open) => setCollapsed(!open)}>
        <div className={`p-4 flex items-center justify-between border-l-4 ${getBorderColor()} ${getBackgroundColor()}`}>
          <div className="flex items-center space-x-3">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="p-0 h-auto text-monday-text-muted hover:text-monday-text">
                {collapsed ? (
                  <ChevronRight className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            <h3 className="text-lg font-semibold text-monday-text">{group.name}</h3>
            <Badge className={`text-xs font-medium ${getBadgeColor()}`}>
              {requests.length} {requests.length === 1 ? 'item' : 'items'}
            </Badge>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-monday-text-muted hover:text-monday-blue"
            onClick={() => setAddRequestModalOpen(true)}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <CollapsibleContent>
          {requests.length > 0 ? (
            <>
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-gray-50 border-t border-gray-200 text-xs font-medium text-monday-text-secondary">
                <div className="col-span-2">Request</div>
                <div className="col-span-1">Owner</div>
                <div className="col-span-1">Priority</div>
                <div className="col-span-1">Status</div>
                <div className="col-span-1">Due Date</div>
                <div className="col-span-2">Creative Brief</div>
                <div className="col-span-1">Assignee</div>
                <div className="col-span-1">Type</div>
                <div className="col-span-2">Project Success Prediction</div>
              </div>

              {/* Table Rows */}
              {requests.map((request) => {
                const owner = getUserById(request.ownerId);
                const assignee = getUserById(request.assigneeId);

                return (
                  <div key={request.id} className="grid grid-cols-12 gap-4 px-4 py-4 border-t border-gray-100 items-center hover:bg-gray-50 transition-colors">
                    <div className="col-span-2">
                      <InlineEdit
                        value={request.name}
                        onSave={(value) => handleRequestUpdate(request.id, "name", value)}
                        className="p-2 rounded hover:bg-gray-100 transition-colors"
                      />
                    </div>
                    
                    <div className="col-span-1">
                      {owner ? (
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium"
                          style={{ backgroundColor: owner.color }}
                        >
                          {getUserInitials(owner)}
                        </div>
                      ) : (
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <Plus className="w-3 h-3 text-gray-500" />
                        </div>
                      )}
                    </div>
                    
                    <div className="col-span-1">
                      <PriorityBadge priority={request.priority as "low" | "medium" | "high"} />
                    </div>
                    
                    <div className="col-span-1">
                      <StatusBadge status={request.status as "working" | "completed" | "progress"} />
                    </div>
                    
                    <div className="col-span-1">
                      <InlineEdit
                        value={request.dueDate ? new Date(request.dueDate).toLocaleDateString() : ""}
                        onSave={(value) => handleRequestUpdate(request.id, "dueDate", value)}
                        className="p-2 rounded hover:bg-gray-100 transition-colors text-sm text-monday-text-secondary"
                        placeholder="No due date"
                      />
                    </div>
                    
                    <div className="col-span-2">
                      <InlineEdit
                        value={request.creativeBrief || ""}
                        onSave={(value) => handleRequestUpdate(request.id, "creativeBrief", value)}
                        className="p-2 rounded hover:bg-gray-100 transition-colors text-sm text-monday-text"
                        placeholder="Add creative brief..."
                      />
                    </div>
                    
                    <div className="col-span-1">
                      {assignee ? (
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium"
                          style={{ backgroundColor: assignee.color }}
                        >
                          {getUserInitials(assignee)}
                        </div>
                      ) : (
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <Plus className="w-3 h-3 text-gray-500" />
                        </div>
                      )}
                    </div>
                    
                    <div className="col-span-1">
                      {request.type && (
                        <Badge 
                          variant="secondary" 
                          className={
                            request.type === "Social Media" ? "bg-red-100 text-red-700" :
                            request.type === "Document" ? "bg-purple-100 text-purple-700" :
                            request.type === "Landing Page" ? "bg-pink-100 text-pink-700" :
                            "bg-gray-100 text-gray-700"
                          }
                        >
                          {request.type}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="col-span-2">
                      <div className="text-sm text-monday-text">
                        {request.prediction || "No prediction available"}
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            <div className="px-4 py-8 text-center text-monday-text-muted">
              <i className="fas fa-tasks text-2xl mb-2"></i>
              <p className="text-sm">No items in {group.name.toLowerCase()}</p>
            </div>
          )}

          {/* Add new item row */}
          <div className="px-4 py-3 border-t border-gray-100">
            <Button 
              variant="ghost" 
              className="text-monday-blue hover:text-blue-600 text-sm"
              onClick={() => setAddRequestModalOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add request
            </Button>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Add Request Modal for this specific group */}
      <AddRequestModal 
        open={addRequestModalOpen}
        onOpenChange={setAddRequestModalOpen}
        defaultGroupId={group.id}
      />
    </div>
  );
}
