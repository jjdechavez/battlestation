import Sortable from 'sortablejs';
import htmx from 'htmx.org';

htmx.onLoad(function () {
  const workspaceTasks = document.querySelectorAll('.sortable');
  console.log(workspaceTasks);

  for (var i = 0; i < workspaceTasks.length; i++) {
    let sortable = workspaceTasks[i];
    new Sortable(sortable, {
      group: 'sections',
      animation: 150,
    });
  }

  const parentList = document.querySelector('#test');
  htmx.process(parentList);
});
