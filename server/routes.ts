import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertRequestSchema, insertGroupSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Workspaces
  app.get("/api/workspaces", async (req, res) => {
    try {
      const workspaces = await storage.getWorkspaces();
      res.json(workspaces);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch workspaces" });
    }
  });

  // Boards
  app.get("/api/workspaces/:workspaceId/boards", async (req, res) => {
    try {
      const { workspaceId } = req.params;
      const boards = await storage.getBoardsByWorkspace(workspaceId);
      res.json(boards);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch boards" });
    }
  });

  app.get("/api/boards/:boardId", async (req, res) => {
    try {
      const { boardId } = req.params;
      const board = await storage.getBoard(boardId);
      if (!board) {
        return res.status(404).json({ message: "Board not found" });
      }
      res.json(board);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch board" });
    }
  });

  // Groups
  app.get("/api/boards/:boardId/groups", async (req, res) => {
    try {
      const { boardId } = req.params;
      const groups = await storage.getGroupsByBoard(boardId);
      res.json(groups);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch groups" });
    }
  });

  app.post("/api/boards/:boardId/groups", async (req, res) => {
    try {
      const { boardId } = req.params;
      const groupData = insertGroupSchema.parse({ ...req.body, boardId });
      const group = await storage.createGroup(groupData);
      res.status(201).json(group);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid group data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create group" });
      }
    }
  });

  app.patch("/api/groups/:groupId", async (req, res) => {
    try {
      const { groupId } = req.params;
      const updates = req.body;
      const group = await storage.updateGroup(groupId, updates);
      if (!group) {
        return res.status(404).json({ message: "Group not found" });
      }
      res.json(group);
    } catch (error) {
      res.status(500).json({ message: "Failed to update group" });
    }
  });

  // Requests
  app.get("/api/groups/:groupId/requests", async (req, res) => {
    try {
      const { groupId } = req.params;
      const requests = await storage.getRequestsByGroup(groupId);
      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch requests" });
    }
  });

  app.get("/api/boards/:boardId/requests", async (req, res) => {
    try {
      const { boardId } = req.params;
      const requests = await storage.getRequestsByBoard(boardId);
      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch requests" });
    }
  });

  app.post("/api/groups/:groupId/requests", async (req, res) => {
    try {
      const { groupId } = req.params;
      
      // Get the next position for the request in this group
      const existingRequests = await storage.getRequestsByGroup(groupId);
      const nextPosition = (existingRequests.length + 1).toString();
      
      const requestData = insertRequestSchema.parse({ 
        ...req.body, 
        groupId,
        position: nextPosition
      });
      
      const request = await storage.createRequest(requestData);
      res.status(201).json(request);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid request data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create request" });
      }
    }
  });

  app.patch("/api/requests/:requestId", async (req, res) => {
    try {
      const { requestId } = req.params;
      const updates = req.body;
      const request = await storage.updateRequest(requestId, updates);
      if (!request) {
        return res.status(404).json({ message: "Request not found" });
      }
      res.json(request);
    } catch (error) {
      res.status(500).json({ message: "Failed to update request" });
    }
  });

  app.delete("/api/requests/:requestId", async (req, res) => {
    try {
      const { requestId } = req.params;
      const success = await storage.deleteRequest(requestId);
      if (!success) {
        return res.status(404).json({ message: "Request not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete request" });
    }
  });

  // Users
  app.get("/api/users", async (req, res) => {
    try {
      const users = await storage.getUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
