# simple-treeview

Awfully basic JavaScript treeview component.

## Usage

### Vanilla Tree View

- Include the tree view CSS:

```html
<link rel="stylesheet" href="../dist/treeview.vanilla.css">
```

- Load the tree view JavaScript (as an ES module), and use the `VanillaTreeView` class:

```html
<script type="module">
    import { VanillaTreeView } from '../dist/treeview.vanilla.js';
    let tree = new VanillaTreeView(document.getElementById('tree'), {
        provider: {
            async getChildren(id) {
                if (!id) {
                    return [
                        { id: 'n1', label: 'Node #1' },
                        { id: 'n2', label: 'Node #2' }
                    ];
                } else {
                    return [];
                }
            }
        }
    });
</script>
```

### Bootstrap Tree View

- Make sure you include Bootstrap dependencies, incl. Bootstrap Icons, for example:

```html
<!-- CSS -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css">
<!-- JavaScript -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.bundle.min.js"></script>
```

- Include the tree view CSS:

```html
<link rel="stylesheet" href="../dist/treeview.bootstrap.css">
```

- Load the tree view JavaScript (as an ES module), and use the `BootstrapTreeView` class:

```html
<script type="module">
    import { BootstrapTreeView } from '../dist/treeview.bootstrap.js';
    let tree = new BootstrapTreeView(document.getElementById('tree'), {
        provider: {
            async getChildren(id) {
                if (!id) {
                    return [
                        { id: 'n1', label: 'Node #1' },
                        { id: 'n2', label: 'Node #2' }
                    ];
                } else {
                    return [];
                }
            }
        }
    });
</script>
```
