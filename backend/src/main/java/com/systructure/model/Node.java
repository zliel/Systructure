package com.systructure.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "nodes")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Node {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    public Long id;

    @NotBlank(message = "Node name is required")
    @Size(min = 1, max = 255, message = "Node name must be between 1 and 255 characters")
    public String name;

    @NotNull(message = "Node type is required")
    @Enumerated(EnumType.STRING)
    public NodeType type;
    public Float xPos;
    public Float yPos;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id")
    private Project project;
}
