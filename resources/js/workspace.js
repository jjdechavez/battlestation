import Sortable from 'sortablejs';

// htmx is already on window
htmx.onLoad(function () {
  const workspaceTasks = document.querySelectorAll('.sortable');

  for (var i = 0; i < workspaceTasks.length; i++) {
    let sortable = workspaceTasks[i];
    new Sortable(sortable, {
      group: 'sections',
      filter: '.task-option',
      animation: 150,
      onUpdate: (evt) => {
        const toElement = evt.to;
        const toElementChildren = Array.from(toElement.children);
        const toElementIds = toElementChildren.map(
          (child) => child.querySelector('input').value
        );

        const workspaceSectionId = toElement.id.replace('section-', '');
        const formElement = toElement.closest('form');
        const workspaceId = formElement.dataset.workspaceId;
        const csrfToken = formElement
          .querySelector("input[name='_csrf']")
          .attributes.getNamedItem('value').value;

        htmx.ajax(
          'POST',
          `/dashboard/workspaces/${workspaceId}/sections/${workspaceSectionId}/position`,
          {
            target: '#section-list',
            swap: 'outerHTML',
            values: {
              taskIds: toElementIds,
            },
            headers: {
              'x-csrf-token': csrfToken,
            },
          }
        );
      },
      onAdd: (evt) => {
        const toElement = evt.to;
        const toElementId = toElement.id;

        const fromElement = evt.from;
        const fromElementId = fromElement.id;

        const fromElementChildren = Array.from(fromElement.children);
        const fromIds = fromElementChildren.map(
          (child) => child.querySelector('input').value
        );

        const toElementChildren = Array.from(toElement.children);
        const toIds = toElementChildren.map(
          (child) => child.querySelector('input').value
        );

        const formElement = toElement.closest('form');
        const workspaceId = formElement.dataset.workspaceId;
        const csrfToken = formElement
          .querySelector("input[name='_csrf']")
          .attributes.getNamedItem('value').value;

        htmx.ajax('POST', `/dashboard/workspaces/${workspaceId}/drag`, {
          target: '#section-list',
          values: {
            sections: JSON.stringify({
              [toElementId]: toIds,
              [fromElementId]: fromIds,
            }),
          },
          headers: {
            'x-csrf-token': csrfToken,
          },
        });
      },
    });

    htmx.process(sortable);
  }
});
