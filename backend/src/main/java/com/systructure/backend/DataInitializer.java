package com.systructure.backend;

import com.systructure.model.*;
import com.systructure.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final NodeRepository nodeRepository;
    private final EdgeRepository edgeRepository;

    public DataInitializer(UserRepository userRepository,
                           ProjectRepository projectRepository,
                           ProjectMemberRepository projectMemberRepository,
                           NodeRepository nodeRepository,
                           EdgeRepository edgeRepository) {
        this.userRepository = userRepository;
        this.projectRepository = projectRepository;
        this.projectMemberRepository = projectMemberRepository;
        this.nodeRepository = nodeRepository;
        this.edgeRepository = edgeRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // Only initialize if database is empty
        if (userRepository.count() > 0) {
            System.out.println("Database already contains data. Skipping initialization.");
            return;
        }

        System.out.println("Initializing database with baseline data...");

        // Create Users
        User admin = new User();
        admin.setUsername("admin");
        admin.setPassword("admin123"); // In production, use proper password hashing
        admin.setEmail("admin@systructure.com");
        admin.setRole(Role.ADMIN);
        admin = userRepository.save(admin);

        User alice = new User();
        alice.setUsername("alice");
        alice.setPassword("password123");
        alice.setEmail("alice@example.com");
        alice.setRole(Role.USER);
        alice = userRepository.save(alice);

        User bob = new User();
        bob.setUsername("bob");
        bob.setPassword("password123");
        bob.setEmail("bob@example.com");
        bob.setRole(Role.USER);
        bob = userRepository.save(bob);

        User charlie = new User();
        charlie.setUsername("charlie");
        charlie.setPassword("password123");
        charlie.setEmail("charlie@example.com");
        charlie.setRole(Role.USER);
        charlie = userRepository.save(charlie);

        System.out.println("Created 4 users: admin, alice, bob, charlie");

        // Create Alice's Solo Project
        Project aliceProject = new Project();
        aliceProject.setName("Alice's Personal App");
        aliceProject.setDescription("A solo project for prototyping");
        aliceProject.setCreatedBy(alice);
        aliceProject.setIsPublic(false);
        projectRepository.save(aliceProject);

        // Add Alice as OWNER
        ProjectMember aliceOwnership = new ProjectMember();
        aliceOwnership.setProject(aliceProject);
        aliceOwnership.setUser(alice);
        aliceOwnership.setProjectRole(ProjectRole.OWNER);
        projectMemberRepository.save(aliceOwnership);

        // Add some nodes to Alice's project
        Node node1 = new Node();
        node1.setName("User Service");
        node1.setType(NodeType.SERVICE);
        node1.setXPos(100f);
        node1.setYPos(100f);
        nodeRepository.save(node1);
        aliceProject.getNodes().add(node1);

        Node node2 = new Node();
        node2.setName("Database");
        node2.setType(NodeType.DATABASE);
        node2.setXPos(300f);
        node2.setYPos(100f);
        node2 = nodeRepository.save(node2);
        aliceProject.getNodes().add(node2);

        Edge edge1 = new Edge();
        edge1.setSourceNode(node1);
        edge1.setTargetNode(node2);
        edge1 = edgeRepository.save(edge1);
        aliceProject.getEdges().add(edge1);

        projectRepository.save(aliceProject);

        System.out.println("Created Alice's solo project with 2 nodes and 1 edge");

        // Create Team Collaboration Project
        Project teamProject = new Project();
        teamProject.setName("Team Microservices Architecture");
        teamProject.setDescription("A collaborative project for the team");
        teamProject.setCreatedBy(bob);
        teamProject.setIsPublic(false);
        projectRepository.save(teamProject);

        // Bob is OWNER
        ProjectMember bobOwnership = new ProjectMember();
        bobOwnership.setProject(teamProject);
        bobOwnership.setUser(bob);
        bobOwnership.setProjectRole(ProjectRole.OWNER);
        projectMemberRepository.save(bobOwnership);

        // Alice is EDITOR
        ProjectMember aliceEditor = new ProjectMember();
        aliceEditor.setProject(teamProject);
        aliceEditor.setUser(alice);
        aliceEditor.setProjectRole(ProjectRole.EDITOR);
        projectMemberRepository.save(aliceEditor);

        // Charlie is VIEWER
        ProjectMember charlieViewer = new ProjectMember();
        charlieViewer.setProject(teamProject);
        charlieViewer.setUser(charlie);
        charlieViewer.setProjectRole(ProjectRole.VIEWER);
        projectMemberRepository.save(charlieViewer);

        // Add nodes to team project
        Node apiGateway = new Node();
        apiGateway.setName("API Gateway");
        apiGateway.setType(NodeType.SERVICE);
        apiGateway.setXPos(150f);
        apiGateway.setYPos(50f);
        apiGateway = nodeRepository.save(apiGateway);
        teamProject.getNodes().add(apiGateway);

        Node authService = new Node();
        authService.setName("Auth Service");
        authService.setType(NodeType.SERVICE);
        authService.setXPos(100f);
        authService.setYPos(200f);
        authService = nodeRepository.save(authService);
        teamProject.getNodes().add(authService);

        Node userService = new Node();
        userService.setName("User Service");
        userService.setType(NodeType.SERVICE);
        userService.setXPos(250f);
        userService.setYPos(200f);
        nodeRepository.save(userService);
        teamProject.getNodes().add(userService);

        Node database = new Node();
        database.setName("Shared Database");
        database.setType(NodeType.DATABASE);
        database.setXPos(175f);
        database.setYPos(350f);
        database = nodeRepository.save(database);
        teamProject.getNodes().add(database);

        // Add edges
        Edge e1 = new Edge();
        e1.setSourceNode(apiGateway);
        e1.setTargetNode(authService);
        edgeRepository.save(e1);
        teamProject.getEdges().add(e1);

        Edge e2 = new Edge();
        e2.setSourceNode(apiGateway);
        e2.setTargetNode(userService);
        edgeRepository.save(e2);
        teamProject.getEdges().add(e2);

        Edge e3 = new Edge();
        e3.setSourceNode(authService);
        e3.setTargetNode(database);
        edgeRepository.save(e3);
        teamProject.getEdges().add(e3);

        Edge e4 = new Edge();
        e4.setSourceNode(userService);
        e4.setTargetNode(database);
        edgeRepository.save(e4);
        teamProject.getEdges().add(e4);

        projectRepository.save(teamProject);

        System.out.println("Created team collaboration project with 3 members (OWNER, EDITOR, VIEWER) and 4 nodes with 4 edges");

        // Create Public Demo Project
        Project demoProject = new Project();
        demoProject.setName("Public Demo Project");
        demoProject.setDescription("A public example project for demonstration");
        demoProject.setCreatedBy(admin);
        demoProject.setIsPublic(true);
        projectRepository.save(demoProject);

        ProjectMember adminOwnership = new ProjectMember();
        adminOwnership.setProject(demoProject);
        adminOwnership.setUser(admin);
        adminOwnership.setProjectRole(ProjectRole.OWNER);
        projectMemberRepository.save(adminOwnership);

        Node demoNode = new Node();
        demoNode.setName("Demo Component");
        demoNode.setType(NodeType.SERVICE);
        demoNode.setXPos(200f);
        demoNode.setYPos(200f);
        demoNode = nodeRepository.save(demoNode);
        demoProject.getNodes().add(demoNode);

        projectRepository.save(demoProject);

        System.out.println("Created public demo project");

        System.out.println("\n=== Initialization Complete ===");
        System.out.println("Total Users: " + userRepository.count());
        System.out.println("Total Projects: " + projectRepository.count());
        System.out.println("Total Project Memberships: " + projectMemberRepository.count());
        System.out.println("Total Nodes: " + nodeRepository.count());
        System.out.println("Total Edges: " + edgeRepository.count());
        System.out.println("\nTest Accounts:");
        System.out.println("  - admin/admin123 (ADMIN role)");
        System.out.println("  - alice/password123 (USER role, owns 1 project, editor on 1)");
        System.out.println("  - bob/password123 (USER role, owns 1 team project)");
        System.out.println("  - charlie/password123 (USER role, viewer on 1 project)");
        System.out.println("================================\n");
    }
}
