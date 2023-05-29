const access = require("../security/defines").access;
const admin = require("../security/defines").admin;
const entity = require("../security/defines").entity;
const { PrismaClient } = require("@prisma/client");
const { subject } = require("@casl/ability");
const prismaClient = new PrismaClient();

exports.repos = async (req, res) => {
  switch (req.method) {
    case "GET":
      try {
        if (req.ability.can(access.read, entity.repos)) {
          let repos = await prismaClient.repos.findMany({select: {id: true,name: true,authorId: true,}});
          res.status(200).json(repos);
        } else return res.status(403).send("Not enough rights");
      } catch (err) {
        return res.status(500).send(`Internal error server (${err.message})`);
      }
      break;
      
    case "POST":
      try {
        if (req.ability.can(access.create, entity.repos)) {
          let repos = await prismaClient.repos.create({data: {name: req.body.name,authorId: parseInt(req.payload.id),},});
          res.status(200).json(repos);
        } else return res.status(403).send("Not enough rights");
      } catch (err) {
        return res.status(500).send(`Internal error server (${err.message})`);
      }
      break;
    default:
      return res.status(405).send("Method not allowed");
  }
};

exports.reposById = async (req, res) => {
  switch (req.method) {
    case "GET":
      try {
        if (req.ability.can(access.read, entity.repos)) {
          let repos = await prismaClient.repos.findUnique({where: { id: parseInt(req.params.id) },});
          res.status(200).json(repos);
        } else return res.status(403).send("Not enough rights");
      } catch (err) {
        return res.status(500).send(`Internal error server (${err.message})`);
      }
      break;
    case "PUT":
      try {
        const repoId = Number(req.params.id);
        const repo = await prismaClient.repos.findFirst({where: {id: repoId,},});
        if (!repo) {
          return res.status(404).send("Resource not found");
        }
        if (!req.ability.can(access.update,subject(entity.repos, { authorId: repo.authorId }))
        ) {
          return res.status(403).send("Not enough rights");
        }
        const updatedRepo = await prismaClient.repos.update({where: {id: repo.id,},data: {name: req.body.name,},});
        res.status(200).json(updatedRepo);
      } catch (err) {
        return res.status(500).send(`Internal error server (${err.message})`);
      }
      break;
    case "DELETE":
      try {
        if (req.ability.can(access.delete, entity.repos)) {
          let repos = await prismaClient.repos.delete({where: { id: parseInt(req.params.id) },});
          res.status(200).json(repos);
        } else return res.status(403).send("Not enough rights");
      } catch (err) {
        return res.status(500).send(`Internal error server (${err.message})`);
      }
      break;
    default:
      return res.status(405).send("Method not allowed");
  }
};
