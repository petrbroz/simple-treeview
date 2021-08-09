import { TreeView } from './TreeView';

export class VanillaTreeView extends TreeView {
    protected render(id: string, label: string, state: 'collapsed' | 'expanded' | 'loading'): HTMLElement {
        const el = document.createElement('div');
        switch (state) {
            case 'collapsed':
                el.classList.add('treeview-node-collapsed');
                break;
            case 'expanded':
                el.classList.add('treeview-node-expanded');
                break;
            case 'loading':
                el.classList.add('treeview-node-loading');
                break;
            default:
                el.classList.add('treeview-node-leaf');
                break;
        }
        el.innerText = label;
        return el;
    }

    protected onClick(el: HTMLElement, id: string, label: string, level: number) {
        alert(`Clicked on ${label} (id: ${id})`);
    }
}
