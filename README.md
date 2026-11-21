# hello-headlamp

A small Headlamp plugin I built to learn the plugin system.

## What it does

- Adds a Say Hello button to the app bar
- Adds a Welcome entry to the cluster sidebar
- Shows a Welcome page with the number of nodes in the cluster, plus each node's name and kubelet version, read live with K8s.ResourceClasses.Node.useList()
- Adds a Pods page under Welcome with a sortable, filterable list of pods, built with ResourceListView
- Adds a Container Images column to Headlamp's built-in Pods list
- Adds a Container Resources section to the built-in Pod detail page, showing CPU and memory requests and limits per container

## Run it locally

You need Node 20.18.1 or later, the Headlamp desktop app and a Kubernetes cluster, such as Docker Desktop with Kubernetes turned on.

```
npm install
npm run start
```

Reload Headlamp with Ctrl + R, open your cluster and click Welcome at the bottom of the sidebar.

## Notes

Creating the plugin with @kinvolk/headlamp-plugin 0.14.0 failed with an EINTEGRITY error. Creating with --noinstall, deleting package-lock.json and running npm install fixed the error. The Headlamp maintainers closed issue 8221 with a fix on main.