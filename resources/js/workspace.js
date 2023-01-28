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
      onEnd: (evt) => {
        if (evt.pullMode) {
          const toElement = evt.to;
          const childrens = Array.from(toElement.children);
          const ids = childrens.map(
            (child) => child.querySelector('input').value
          );
          const formElement = toElement.closest('form');
          const csrfToken = formElement
            .querySelector("input[name='_csrf']")
            .attributes.getNamedItem('value').value;

          const htmxPath = formElement.attributes
            .getNamedItem('hx-post')
            .value.replace('position', 'drag');

          const htmxTarget =
            formElement.attributes.getNamedItem('hx-target').value;
          const htmxSwap = formElement.attributes.getNamedItem('hx-swap').value;
          const htmxValues = { taskIds: ids, statusCode: 200 };

          htmx.ajax('POST', htmxPath, {
            target: htmxTarget,
            swap: htmxSwap,
            values: htmxValues,
            headers: {
              'x-csrf-token': csrfToken,
            },
          });
        }
      },
    });

    htmx.process(sortable);
  }
});
