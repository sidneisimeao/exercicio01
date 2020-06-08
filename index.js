const express = require("express");

const server = express();

server.use(express.json());

// Projetcs
const projects = [];

// Encontra um projeto pelo ID
const getProjectById = (id) => projects.find((project) => project.id === id);

// Verifica se um proheto existe
const checkProjectExists = (req, res, next) => {
  const { id } = req.params;
  const project = getProjectById(id);

  if (!project) {
    return res.status(400).json({ error: "Projeto não existe" });
  }
  req.project = project;
  return next();
};

// Lista todos projetos
server.get("/projects", (req, res) => {
  return res.json(projects);
});

// Lista um projeto
server.get("/projects/:id", checkProjectExists, (req, res) => {
  const project = req.project;
  return res.json(project);
});

// Cria um novo projeto
server.post("/projects", (req, res) => {
  const { id, title, tasks } = req.body;

  const project = getProjectById(id);

  if (project) {
    return res.status(400).json({ error: "Este id já esta sendo usado" });
  }
  projects.push({ id, title, tasks });
  return res.json(projects);
});

// Altera um projeto
server.put("/projects/:id", checkProjectExists, (req, res) => {
  const { title } = req.body;
  const project = req.project;

  project.title = title;

  return res.json(project);
});

server.delete("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const projectIndex = projects.findIndex((project) => project.id === id);

  projects.splice(projectIndex, 1);
  return res.send("Projeto deletado");
});

server.post("/projects/:id/tasks", checkProjectExists, (req, res) => {
  const project = req.project;
  const { task } = req.body;
  project.tasks.push(task);
  return res.json(project);
});

// Start server on port
server.listen(3000);
