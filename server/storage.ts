import { type Workspace, type Board, type Group, type Request, type User, type InsertWorkspace, type InsertBoard, type InsertGroup, type InsertRequest, type InsertUser } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Workspaces
  getWorkspaces(): Promise<Workspace[]>;
  getWorkspace(id: string): Promise<Workspace | undefined>;
  createWorkspace(workspace: InsertWorkspace): Promise<Workspace>;

  // Boards
  getBoardsByWorkspace(workspaceId: string): Promise<Board[]>;
  getBoard(id: string): Promise<Board | undefined>;
  createBoard(board: InsertBoard): Promise<Board>;

  // Groups
  getGroupsByBoard(boardId: string): Promise<Group[]>;
  getGroup(id: string): Promise<Group | undefined>;
  createGroup(group: InsertGroup): Promise<Group>;
  updateGroup(id: string, updates: Partial<Group>): Promise<Group | undefined>;

  // Requests
  getRequestsByGroup(groupId: string): Promise<Request[]>;
  getRequestsByBoard(boardId: string): Promise<Request[]>;
  getRequest(id: string): Promise<Request | undefined>;
  createRequest(request: InsertRequest): Promise<Request>;
  updateRequest(id: string, updates: Partial<Request>): Promise<Request | undefined>;
  deleteRequest(id: string): Promise<boolean>;

  // Users
  getUsers(): Promise<User[]>;
  getUser(id: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
}

export class MemStorage implements IStorage {
  private workspaces: Map<string, Workspace> = new Map();
  private boards: Map<string, Board> = new Map();
  private groups: Map<string, Group> = new Map();
  private requests: Map<string, Request> = new Map();
  private users: Map<string, User> = new Map();

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Create sample users
    const users = [
      { id: randomUUID(), name: "John Doe", email: "john@example.com", initials: "JD", color: "#635BFF", avatar: "" },
      { id: randomUUID(), name: "Alice Miller", email: "alice@example.com", initials: "AM", color: "#00CA72", avatar: "" },
      { id: randomUUID(), name: "Design Studio", email: "design@example.com", initials: "DS", color: "#E2445C", avatar: "" },
      { id: randomUUID(), name: "Lisa Chen", email: "lisa@example.com", initials: "LC", color: "#FF5A91", avatar: "" },
    ];

    users.forEach(user => this.users.set(user.id, user));
    const userIds = Array.from(this.users.keys());

    // Create workspace
    const workspace: Workspace = {
      id: randomUUID(),
      name: "Creative MY OWN Channel",
      description: "Main workspace for creative projects",
      color: "#635BFF",
      createdAt: new Date(),
    };
    this.workspaces.set(workspace.id, workspace);

    // Create board
    const board: Board = {
      id: randomUUID(),
      workspaceId: workspace.id,
      name: "Creative MY OWN Channel",
      description: "Main board for managing creative requests",
      createdAt: new Date(),
    };
    this.boards.set(board.id, board);

    // Create groups
    const groups = [
      { id: randomUUID(), boardId: board.id, name: "Incoming Requests", color: "#3498db", position: "1", collapsed: "false" },
      { id: randomUUID(), boardId: board.id, name: "In progress", color: "#9b59b6", position: "2", collapsed: "false" },
      { id: randomUUID(), boardId: board.id, name: "Completed", color: "#27ae60", position: "3", collapsed: "false" },
    ];

    groups.forEach(group => this.groups.set(group.id, group));

    // Create sample requests
    const requests = [
      {
        id: randomUUID(),
        groupId: groups[0].id, // Incoming Requests
        name: "Creative 1",
        creativeBrief: "Landing page about working with us",
        status: "working",
        priority: "medium",
        type: "Social Media",
        dueDate: null,
        ownerId: userIds[0],
        assigneeId: null,
        prediction: "Low likelihood of success because: The concept needs more...",
        position: "1",
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        groupId: groups[2].id, // Completed
        name: "Creative 3",
        creativeBrief: "I need a flyer to send to our customers",
        status: "completed",
        priority: "low",
        type: "Document",
        dueDate: null,
        ownerId: userIds[1],
        assigneeId: userIds[2],
        prediction: "High likelihood of success",
        position: "1",
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        groupId: groups[2].id, // Completed
        name: "Creative 2",
        creativeBrief: "The campaign is going to be an email marketing...",
        status: "completed",
        priority: "medium",
        type: "Landing Page",
        dueDate: null,
        ownerId: userIds[0],
        assigneeId: userIds[3],
        prediction: "High likelihood of success",
        position: "2",
        createdAt: new Date(),
      },
    ];

    requests.forEach(request => this.requests.set(request.id, request));
  }

  // Workspaces
  async getWorkspaces(): Promise<Workspace[]> {
    return Array.from(this.workspaces.values());
  }

  async getWorkspace(id: string): Promise<Workspace | undefined> {
    return this.workspaces.get(id);
  }

  async createWorkspace(workspace: InsertWorkspace): Promise<Workspace> {
    const id = randomUUID();
    const newWorkspace: Workspace = { ...workspace, id, createdAt: new Date() };
    this.workspaces.set(id, newWorkspace);
    return newWorkspace;
  }

  // Boards
  async getBoardsByWorkspace(workspaceId: string): Promise<Board[]> {
    return Array.from(this.boards.values()).filter(board => board.workspaceId === workspaceId);
  }

  async getBoard(id: string): Promise<Board | undefined> {
    return this.boards.get(id);
  }

  async createBoard(board: InsertBoard): Promise<Board> {
    const id = randomUUID();
    const newBoard: Board = { ...board, id, createdAt: new Date() };
    this.boards.set(id, newBoard);
    return newBoard;
  }

  // Groups
  async getGroupsByBoard(boardId: string): Promise<Group[]> {
    return Array.from(this.groups.values())
      .filter(group => group.boardId === boardId)
      .sort((a, b) => parseInt(a.position) - parseInt(b.position));
  }

  async getGroup(id: string): Promise<Group | undefined> {
    return this.groups.get(id);
  }

  async createGroup(group: InsertGroup): Promise<Group> {
    const id = randomUUID();
    const newGroup: Group = { ...group, id };
    this.groups.set(id, newGroup);
    return newGroup;
  }

  async updateGroup(id: string, updates: Partial<Group>): Promise<Group | undefined> {
    const group = this.groups.get(id);
    if (!group) return undefined;
    
    const updatedGroup = { ...group, ...updates };
    this.groups.set(id, updatedGroup);
    return updatedGroup;
  }

  // Requests
  async getRequestsByGroup(groupId: string): Promise<Request[]> {
    return Array.from(this.requests.values())
      .filter(request => request.groupId === groupId)
      .sort((a, b) => parseInt(a.position) - parseInt(b.position));
  }

  async getRequestsByBoard(boardId: string): Promise<Request[]> {
    const groups = await this.getGroupsByBoard(boardId);
    const groupIds = groups.map(g => g.id);
    return Array.from(this.requests.values())
      .filter(request => groupIds.includes(request.groupId))
      .sort((a, b) => parseInt(a.position) - parseInt(b.position));
  }

  async getRequest(id: string): Promise<Request | undefined> {
    return this.requests.get(id);
  }

  async createRequest(request: InsertRequest): Promise<Request> {
    const id = randomUUID();
    const newRequest: Request = { ...request, id, createdAt: new Date() };
    this.requests.set(id, newRequest);
    return newRequest;
  }

  async updateRequest(id: string, updates: Partial<Request>): Promise<Request | undefined> {
    const request = this.requests.get(id);
    if (!request) return undefined;
    
    const updatedRequest = { ...request, ...updates };
    this.requests.set(id, updatedRequest);
    return updatedRequest;
  }

  async deleteRequest(id: string): Promise<boolean> {
    return this.requests.delete(id);
  }

  // Users
  async getUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = randomUUID();
    const newUser: User = { ...user, id };
    this.users.set(id, newUser);
    return newUser;
  }
}

export const storage = new MemStorage();
