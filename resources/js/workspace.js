import Sortable from "sortablejs"

const workspaceTasks = document.querySelectorAll(".workspace-tasks");

for (var i = 0; i < workspaceTasks.length; i++) {
  let sortable = workspaceTasks[i];
  new Sortable(sortable, {
      group: 'sections',
      animation: 150,
  });
}
