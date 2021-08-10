# simple-treeview

Awfully basic JavaScript treeview component.

- API documentation: https://unpkg.com/simple-treeview/docs/index.html
- Live demo
    - Vanilla: https://unpkg.com/simple-treeview/examples/vanilla.html
    - Bootstrap: https://unpkg.com/simple-treeview/examples/bootstrap.html

## Usage

### Vanilla Tree View

- Include the treeview CSS:

```html
<link rel="stylesheet" href="https://unpkg.com/simple-treeview/dist/treeview.vanilla.css">
```

- If you want to use [Font Awesome](https://fontawesome.com) icons, include its CSS as well:

```html
<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.15.4/css/all.css" integrity="sha384-DyZ88mC6Up2uqS4h/KRgHuoeGwBcD4Ng9SiP4dIRy0EXTlnuz47vAwmeGwVChigm" crossorigin="anonymous">
```

- Load the treeview JavaScript (as an ES module), and use the `VanillaTreeView` class:

```html
<script type="module">
    import { VanillaTreeView } from 'https://unpkg.com/simple-treeview/dist/treeview.vanilla.js';
    let tree = new VanillaTreeView(document.getElementById('tree'), {
        provider: {
            async getChildren(id) {
                if (!id) {
                    return [
                        { id: 'p1', label: 'Parent #1', icon: 'fa-folder', state: 'collapsed' },
                        { id: 'p2', label: 'Parent #2', icon: 'fa-folder', state: 'expanded' }
                    ];
                } else {
                    await new Promise((resolve, reject) => setTimeout(resolve, 1000)); // Simulate 1s delay
                    switch (id) {
                        case 'p1':
                            return [
                                { id: 'c1', label: 'Child #1', icon: 'fa-file', state: 'collapsed' },
                                { id: 'c2', label: 'Child #2', icon: 'fa-file' }
                            ];
                        case 'p2':
                            return [
                                { id: 'c3', label: 'Child #3', icon: 'fa-file' },
                                { id: 'c4', label: 'Child #4', icon: 'fa-file' }
                            ];
                        case 'c1':
                            return [
                                { id: 'g1', label: 'Grandchild #1', icon: 'fa-clock' }
                            ];
                        default:
                            return [];
                    }
                }
            }
        }
    });
</script>
```

### Bootstrap Tree View

- Make sure you include Bootstrap dependencies (incl. [Bootstrap Icons](https://icons.getbootstrap.com/) if you want to use those, too), for example:

```html
<!-- CSS -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css">
<!-- JavaScript -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.bundle.min.js"></script>
```

- Include the treeview CSS:

```html
<link rel="stylesheet" href="https://unpkg.com/simple-treeview/dist/treeview.bootstrap.css">
```

- Load the treeview JavaScript (as an ES module), and use the `BootstrapTreeView` class:

```html
<script type="module">
    import { BootstrapTreeView } from 'https://unpkg.com/simple-treeview/dist/treeview.bootstrap.js';
    let tree = new BootstrapTreeView(document.getElementById('tree'), {
        provider: {
            async getChildren(id) {
                if (!id) {
                    return [
                        { id: 'p1', label: 'Parent #1', icon: 'bi-folder', state: 'collapsed' },
                        { id: 'p2', label: 'Parent #2', icon: 'bi-folder', state: 'expanded' }
                    ];
                } else {
                    await new Promise((resolve, reject) => setTimeout(resolve, 1000));
                    switch (id) {
                        case 'p1':
                            return [
                                { id: 'c1', label: 'Child #1', icon: 'bi-file-earmark', state: 'collapsed' },
                                { id: 'c2', label: 'Child #2', icon: 'bi-file-earmark' }
                            ];
                        case 'p2':
                            return [
                                { id: 'c3', label: 'Child #3', icon: 'bi-file-earmark' },
                                { id: 'c4', label: 'Child #4', icon: 'bi-file-earmark' }
                            ];
                        case 'c1':
                            return [
                                { id: 'g1', label: 'Grandchild #1', icon: 'bi-clock' }
                            ];
                        default:
                            return [];
                    }
                }
            }
        }
    });
</script>
```
