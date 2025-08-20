import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  List, 
  ListItem, 
  Text,
  Flex,
  Button,
  Avatar,
  Badge,
  TextField
} from "@vibe/core";
import { Plus, ChevronDown, ChevronRight, User } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import type { Group, Request, User } from "@shared/schema";

interface VibeTableProps {
  group: Group;
  requests: Request[];
  users: User[];
}

export function VibeTable({ group, requests, users }: VibeTableProps) {
  const [collapsed, setCollapsed] = useState(group.collapsed === "true");
  const [editingCell, setEditingCell] = useState<string | null>(null);
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
    setEditingCell(null);
  };

  const getUserById = (id: string | null) => {
    if (!id) return null;
    return users.find(user => user.id === id);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "working": return "primary";
      case "completed": return "negative";
      case "progress": return "primary";
      default: return "primary";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "negative";
      case "medium": return "primary";
      case "low": return "primary";
      default: return "primary";
    }
  };

  const renderTableHeader = () => (
    <div
      style={{
        padding: "12px 16px",
        backgroundColor: "var(--primary-background-color)",
        borderBottom: "1px solid var(--ui-border-color)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <Button
          kind="tertiary"
          size="small"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
        </Button>
        <Text type="text1" weight="bold" color="primary">
          {group.name}
        </Text>
        <Badge
          text={`${requests.length} ${requests.length === 1 ? 'item' : 'items'}`}
          color="primary"
        />
      </div>
      <Button kind="tertiary" size="small">
        <Plus size={16} />
      </Button>
    </div>
  );

  const renderTableColumns = () => (
    <div
      style={{
        padding: "8px 16px",
        backgroundColor: "var(--secondary-background-color)",
        borderBottom: "1px solid var(--ui-border-color)",
        fontSize: "12px",
        display: "flex",
      }}
    >
      <div style={{ width: "200px" }}>
        <Text type="text3" weight="medium" color="secondary">Request</Text>
      </div>
      <div style={{ width: "80px" }}>
        <Text type="text3" weight="medium" color="secondary">Owner</Text>
      </div>
      <div style={{ width: "100px" }}>
        <Text type="text3" weight="medium" color="secondary">Priority</Text>
      </div>
      <div style={{ width: "120px" }}>
        <Text type="text3" weight="medium" color="secondary">Status</Text>
      </div>
      <div style={{ width: "100px" }}>
        <Text type="text3" weight="medium" color="secondary">Due Date</Text>
      </div>
      <div style={{ width: "250px" }}>
        <Text type="text3" weight="medium" color="secondary">Creative Brief</Text>
      </div>
      <div style={{ width: "80px" }}>
        <Text type="text3" weight="medium" color="secondary">Assignee</Text>
      </div>
      <div style={{ width: "100px" }}>
        <Text type="text3" weight="medium" color="secondary">Type</Text>
      </div>
      <div style={{ flex: 1 }}>
        <Text type="text3" weight="medium" color="secondary">Project Success Prediction</Text>
      </div>
    </div>
  );

  const renderRequestRow = (request: Request) => {
    const owner = getUserById(request.ownerId);
    const assignee = getUserById(request.assigneeId);

    return (
      <ListItem key={request.id}>
        <div style={{ 
          width: "100%", 
          display: "flex", 
          alignItems: "center",
          padding: "12px 16px",
          borderBottom: "1px solid var(--ui-border-color)",
        }}>
          {/* Request Name */}
          <div style={{ width: "200px" }}>
            {editingCell === `${request.id}-name` ? (
              <TextField
                value={request.name}
                onBlur={(e) => handleRequestUpdate(request.id, "name", e.target.value)}
                onChange={(value) => {}} // Required prop
                autoFocus
                size="small"
              />
            ) : (
              <Text
                type="text2"
                onClick={() => setEditingCell(`${request.id}-name`)}
                style={{ cursor: "pointer" }}
              >
                {request.name}
              </Text>
            )}
          </div>

          {/* Owner */}
          <div style={{ width: "80px" }}>
            {owner ? (
              <Avatar
                size="small"
                text={owner.initials}
                backgroundColor={owner.color}
              />
            ) : (
              <Button kind="tertiary" size="small">
                <Icon icon={Person} />
              </Button>
            )}
          </div>

          {/* Priority */}
          <div style={{ width: "100px" }}>
            <Badge
              text={request.priority}
              color={getPriorityColor(request.priority)}
            />
          </div>

          {/* Status */}
          <div style={{ width: "120px" }}>
            <Badge
              text={request.status === "working" ? "Working on it" : 
                    request.status === "completed" ? "Completed/Live" : 
                    "In Progress"}
              color={getStatusColor(request.status)}
            />
          </div>

          {/* Due Date */}
          <div style={{ width: "100px" }}>
            {editingCell === `${request.id}-dueDate` ? (
              <TextField
                value={request.dueDate ? new Date(request.dueDate).toLocaleDateString() : ""}
                onBlur={(value) => handleRequestUpdate(request.id, "dueDate", value)}
                onEnterPressed={(value) => handleRequestUpdate(request.id, "dueDate", value)}
                placeholder="No due date"
                size="small"
              />
            ) : (
              <Text
                type="text3"
                color="secondary"
                onClick={() => setEditingCell(`${request.id}-dueDate`)}
                style={{ cursor: "pointer" }}
              >
                {request.dueDate ? new Date(request.dueDate).toLocaleDateString() : ""}
              </Text>
            )}
          </div>

          {/* Creative Brief */}
          <div style={{ width: "250px" }}>
            {editingCell === `${request.id}-creativeBrief` ? (
              <TextField
                value={request.creativeBrief || ""}
                onBlur={(value) => handleRequestUpdate(request.id, "creativeBrief", value)}
                onEnterPressed={(value) => handleRequestUpdate(request.id, "creativeBrief", value)}
                placeholder="Add creative brief..."
                size="small"
              />
            ) : (
              <Text
                type="text3"
                onClick={() => setEditingCell(`${request.id}-creativeBrief`)}
                style={{ cursor: "pointer" }}
              >
                {request.creativeBrief || "Add creative brief..."}
              </Text>
            )}
          </div>

          {/* Assignee */}
          <div style={{ width: "80px" }}>
            {assignee ? (
              <Avatar
                size="small"
                text={assignee.initials}
                backgroundColor={assignee.color}
              />
            ) : (
              <Button kind="tertiary" size="small">
                <Icon icon={Person} />
              </Button>
            )}
          </div>

          {/* Type */}
          <div style={{ width: "100px" }}>
            {request.type && (
              <Badge
                text={request.type}
                color="neutral"
              />
            )}
          </div>

          {/* Project Success Prediction */}
          <div style={{ flex: 1 }}>
            <Text type="text3" color="secondary">
              {request.prediction || "No prediction available"}
            </Text>
          </div>
        </Flex>
      </ListItem>
    );
  };

  return (
    <div
      style={{
        backgroundColor: "var(--primary-background-color)",
        borderRadius: "8px",
        overflow: "hidden",
        boxShadow: "var(--box-shadow-small)",
        marginBottom: "16px",
      }}
    >
      {renderTableHeader()}
      
      {!collapsed && (
        <>
          {renderTableColumns()}
          
          {requests.length > 0 ? (
            <List>
              {requests.map(renderRequestRow)}
            </List>
          ) : (
            <div style={{ padding: "32px", textAlign: "center" }}>
              <Text type="text2" color="secondary">
                No items in {group.name.toLowerCase()}
              </Text>
            </div>
          )}

          {/* Add new item row */}
          <div style={{ padding: "12px 16px", borderTop: "1px solid var(--ui-border-color)" }}>
            <Button kind="tertiary" size="small">
              <Icon icon={Add} />
              <Text type="text3">Add request</Text>
            </Button>
          </div>
        </>
      )}
    </div>
  );
}