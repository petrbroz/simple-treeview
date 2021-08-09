import { TreeView } from './TreeView';

export class BootstrapTreeView extends TreeView {
    protected render(id: string, label: string, state: 'collapsed' | 'expanded' | 'loading'): HTMLElement {
        const el = document.createElement('div');
        el.classList.add('list-group-item', 'list-group-item-action');
        const expando = document.createElement('i');
        expando.classList.add('bi');
        el.appendChild(expando);
        const icon = document.createElement('i');
        icon.classList.add('bi');
        el.appendChild(icon);
        const span = document.createElement('span');
        span.innerText = label;
        el.appendChild(span);
        switch (state) {
            case 'collapsed':
                expando.classList.add('bi-chevron-right');
                break;
            case 'expanded':
                expando.classList.add('bi-chevron-down');
                break;
            case 'loading':
                expando.classList.add('bi-hourglass', 'rotating');
                break;
            default: // leaf
                expando.classList.add('bi-dot');
                break;
        }
        if (id.startsWith('p')) {
            icon.classList.add('bi-folder');
        } else if (id.startsWith('c')) {
            icon.classList.add('bi-file-earmark');
        } else if (id.startsWith('g')) {
            icon.classList.add('bi-clock');
        }
        return el;
    }

    protected onClick(el: HTMLElement, id: string, label: string, level: number) {
        if (!this.root) {
            return;
        }
        for (const activeEl of this.root.querySelectorAll('.active')) {
            activeEl.classList.remove('active');
        }
        el.classList.add('active');
    }
}
