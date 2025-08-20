import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";
import { insertRequestSchema } from "@shared/schema";
import { z } from "zod";

const formSchema = insertRequestSchema.extend({
  groupId: z.string().min(1, "Please select a group"),
});

interface AddRequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultGroupId?: string;
}

export function AddRequestModal({ open, onOpenChange, defaultGroupId }: AddRequestModalProps) {
  const queryClient = useQueryClient();

  // Get first workspace and board for demo
  const { data: workspaces } = useQuery({
    queryKey: ["/api/workspaces"],
  });

  const { data: boards } = useQuery({
    queryKey: ["/api/workspaces", workspaces?.[0]?.id, "boards"],
    enabled: !!workspaces?.[0]?.id,
  });

  const { data: groups } = useQuery({
    queryKey: ["/api/boards", boards?.[0]?.id, "groups"],
    enabled: !!boards?.[0]?.id,
  });

  const { data: users } = useQuery({
    queryKey: ["/api/users"],
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      creativeBrief: "",
      status: "working",
      priority: "medium",
      type: "",
      groupId: defaultGroupId || "",
      ownerId: null,
      assigneeId: null,
      prediction: "",
      position: "1",
    },
  });

  // Reset form when modal opens and set default group
  useEffect(() => {
    if (open) {
      form.reset({
        name: "",
        creativeBrief: "",
        status: "working",
        priority: "medium",
        type: "",
        groupId: defaultGroupId || "",
        ownerId: null,
        assigneeId: null,
        prediction: "",
        position: "1",
      });
    }
  }, [open, defaultGroupId, form]);

  const createRequestMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const { groupId, ...requestData } = data;
      await apiRequest("POST", `/api/groups/${groupId}/requests`, requestData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/boards"] });
      toast({ title: "Request created successfully!" });
      form.reset();
      onOpenChange(false);
    },
    onError: () => {
      toast({ title: "Failed to create request", variant: "destructive" });
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    createRequestMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-monday-text">
            Add New Request
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-monday-text font-medium">Request Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter request name" 
                      {...field}
                      className="focus:ring-2 focus:ring-monday-blue focus:border-monday-blue"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="creativeBrief"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-monday-text font-medium">Creative Brief</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your request..." 
                      rows={3}
                      {...field}
                      className="focus:ring-2 focus:ring-monday-blue focus:border-monday-blue"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-monday-text font-medium">Priority</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="focus:ring-2 focus:ring-monday-blue focus:border-monday-blue">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-monday-text font-medium">Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="focus:ring-2 focus:ring-monday-blue focus:border-monday-blue">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Social Media">Social Media</SelectItem>
                        <SelectItem value="Document">Document</SelectItem>
                        <SelectItem value="Landing Page">Landing Page</SelectItem>
                        <SelectItem value="Email Campaign">Email Campaign</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="groupId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-monday-text font-medium">Group</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="focus:ring-2 focus:ring-monday-blue focus:border-monday-blue">
                          <SelectValue placeholder="Select group" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {groups?.map((group) => (
                          <SelectItem key={group.id} value={group.id}>
                            {group.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ownerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-monday-text font-medium">Owner</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                      <FormControl>
                        <SelectTrigger className="focus:ring-2 focus:ring-monday-blue focus:border-monday-blue">
                          <SelectValue placeholder="Select owner" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {users?.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex items-center justify-end space-x-3 pt-4">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="text-monday-text border-gray-300 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-monday-blue hover:bg-blue-600 text-white"
                disabled={createRequestMutation.isPending}
              >
                {createRequestMutation.isPending ? "Creating..." : "Create Request"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
