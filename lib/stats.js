export default {
  /*
    Helper to create groups based on kanban lanes and columns.

    Args:
    - kb: The Brisa Entry for the board.
    - entries: All entries in the board.
  */
  KanbanGroups: function(kb, entries) {
    var groups = [];
    var gmaps = {};
    var md = kb.data.metadata._kanban;
    var g_def = md.lanes[0].groups[0].unique_id;
    
    groups.push({title: 'Total', key: 'all', entries: []});
    for (let lane of md.lanes) {
      let lkey = 'lane_' + lane.unique_id;
      let ldata = {title: lane.title + ' Lane', key: lkey, entries: []};
      groups.push(ldata);
      for (let grp of lane.groups) {
        let gdata = {title: lane.title + ' - ' + grp.title, p: lkey, key: 'grp_' + grp.unique_id, entries: []};
        //groups.push(gdata);
        gmaps[grp.unique_id] = {lane: ldata, group: gdata};
      }
    }
    for (let ent of entries) {
      let grp = ent.data.metadata._kanbans[kb.data.id].group || g_def;
      let g = gmaps[grp];
      groups[0].entries.push(ent);
      g.group.entries.push(ent);
      g.lane.entries.push(ent);
    }
    return groups;
  },

  /*
    Generate stats for a board.

    Args:
    - groups: [ {title: 'Group Name', key: 'grp_key', entries: [BrisaAPI.Entry, ...]}, ... ]
      A list of groups of stats to generate. Eg {title: 'Entire Board', key: 'all', entries: view.entries}.
    - no_archive: Boolean
      If true, archived entries will be ignored.
  */
  Generate: function(groups, no_archive) {
    var results = {};
    
    for (let g of groups) {
      let res = {time: 0, complete: 0, remain: 0, cnt: 0, no_est: []};
      for (let e of g.entries) {
        let est = e.data.time_est || 0, arc = e.data.archived, done = e.data.completed_at;
        if (arc && no_archive) continue;
        if (est == 0) res.no_est.push(e);
        res.time += est;
        res.cnt += 1;
        if (done) res.complete += est; else res.remain += est;
      }
      if (res.cnt > 0 && res.time > 0) {
        res.complete_p = this.decimal(res.complete / res.time * 100);
        res.remain_p = this.decimal(res.remain / res.time * 100);
      }
      results[g.key] = res;
    }
    return results;
  },

  // Small helper to convert a decimal to a specific number of decimal places.
  decimal: function(val, places) {
    if (places === undefined) places = 2;
    var mul = 10 ** places;
    return Number.parseInt(val * mul) / mul;
  },
};
