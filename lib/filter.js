export default {
  init: function(entries, filter, filter_dict) {
    for (let entry of entries) {
      filter_dict[entry.data.id] = this.filter_one(entry, filter);
    }
  },
  filter_one: function(entry, filter) {
    if ((filter.status == 'active' && entry.data.archived) ||
        (filter.status == 'archive' && !entry.data.archived)) {
      return false;
    }

    if (filter.label && entry.data.tags.indexOf(filter.label) == -1) return false;
    if (filter.assign && entry.data.assignees.indexOf(filter.assign) == -1) return false;

    return true;
  },
};
