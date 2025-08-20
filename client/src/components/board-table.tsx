import { useQuery } from "@tanstack/react-query";
import { GroupSection } from "./group-section";
import { VibeTable } from "./vibe-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface BoardTableProps {
  boardId: string;
}

export function BoardTable({ boardId }: BoardTableProps) {
  const { data: groups, isLoading } = useQuery({
    queryKey: ["/api/boards", boardId, "groups"],
  });

  const { data: requests } = useQuery({
    queryKey: ["/api/boards", boardId, "requests"],
  });

  const { data: users } = useQuery({
    queryKey: ["/api/users"],
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-monday p-4 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Group requests by group
  const requestsByGroup = requests?.reduce((acc, request) => {
    if (!acc[request.groupId]) {
      acc[request.groupId] = [];
    }
    acc[request.groupId].push(request);
    return acc;
  }, {} as Record<string, typeof requests>) || {};

  return (
    <div className="p-6">
      <div className="space-y-6">
        {groups?.map((group) => (
          <GroupSection
            key={group.id}
            group={group}
            requests={requestsByGroup[group.id] || []}
            users={users || []}
          />
        ))}
        
        {/* Add new group button */}
        <div className="mt-6">
          <Button 
            variant="outline" 
            className="w-full h-12 border-2 border-dashed border-gray-300 hover:border-monday-blue hover:bg-blue-50 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2 text-monday-blue" />
            <span className="text-monday-blue font-medium">Add new group</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
