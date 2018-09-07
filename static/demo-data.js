// Simple script to load static json json entries/models into Brisa
var b_dd = {"entries":[{"data":{"id":1,"title":"1. Click me! (Then click the title again to edit)","tags":["Important"],"description":"All of the cards in this demo are meant to help you explore the features in Brisa Boards.\n\nThis is the card description. You can click and edit this as well.\n\nWhile editing, there are 2 buttons to the right to Save or Cancel editing. If you prefer to stick with the keyboard, you can also use the tab button to move to the save button, then press enter to save.\n\nThere is a close button in the upper right of the popup to close this card. There is also a red trashcan icon to delete it.","metadata":{},"user_id":1}},{"data":{"id":2,"title":"2. Primary Tools","tags":["Important"],"description":"Brisa has 3 main tools to help you organize:\n\n1. Labels and tags.\n  In the settings menu (3 dots in the upper right), there is a tab for Labels. These are common tags you want to be able to access and apply to cards quickly.\n2. Boards.\n  The plus button below this description has different kinds of boards that you can create to help organize an idea or task.\n  Kanban allows you to create groups (like Todo, Started, Testing, Done) and add new cards or move them between groups as you progress.\n  Whiteboard allows you to arrange cards in a free-form way, to give a nice overview of tasks.\n  Sheet creates a spreadsheet-like interface to organize a list of items. (See #3 below for extending sheets)\n3. Models.\n  Models allow you to add fields to cards. In the settings menu, there is a section for creating models and adding fields to them. These can be helpful for cards in general, but they are especially useful for Sheets, allowing you to expand the fields available to edit.","metadata":{},"user_id":1}},{"data":{"id":3,"title":"3. Important Whiteboard","tags":["Important"],"description":"Click the icon on the right to open your whiteboard view. In the whiteboard view, you can click (or touch) and drag cards to organize in a more free-flow way.\n\nWhen you are adding a new board, the default tag is the title plus the board type. For example, if you had a card titled \"Family Vacation\" and added a sheet to it, the tag would be \"Family Vacation Sheet\".\nWith this whiteboard, the default tag was changed to \"Important\", so any card you create in the Important label on the dashboard will show up in this whiteboard.","metadata":{"_whiteboard":{"classes":null,"tags":["Important"],"positions":{"1":{"x":"20px","y":"0px"},"2":{"x":"20px","y":"190px"},"4":{"x":"620px","y":"0px"}}},"style":{"color":"0,0,0","opacity":"0.0","paper":"","grid":"10","card_bg":""}},"user_id":1,"classes":["_whiteboard"]}},{"data":{"id":4,"title":"4. Stuff I Want To Do","tags":["Important"],"description":"This is an example of a Sheet. It allows you to add items to it and sort them however you want by dragging and dropping them.\n\nIt also shows 2 other things:\n1. Models: These are not normal spredsheets. They are extended with Models that allow you to add additional fields beyond the Title and Description.\n2. Boards: Any card can have another board added to it. This allows you to start small and build on ideas and tasks if and when it becomes necessary.","metadata":{"_sheet":{"classes":["bzBMAtkd-todo_in"],"tags":["4. Stuff I Want To Do Sheet"],"entries":[6,5,7],"models":[]}},"user_id":1,"classes":["_sheet"]}},{"data":{"id":5,"title":"Cook More Often","tags":["4. Stuff I Want To Do Sheet"],"classes":["bzBMAtkd-todo_in","_kanban"],"metadata":{"bzBMAtkd-todo_in":{"1lbeTjjD-priorit":"4","9o0yB8H0-why":"To eat healthier and save money.","qWTBfzKH-overvie":"- Find great, easy recipes.\n- Go grocery shopping more often.\n- Have fun in the kitchen."},"_kanban":{"classes":["D9p5P3hf-recipe"],"tags":null,"groups":[{"unique_id":"jqvzG1ik","title":"Unhealthy"},{"unique_id":"dSKZd6V9","title":"Kind Of Healthy"},{"unique_id":"et9M5WN3","title":"Very Healthy"}],"sorted":{"jqvzG1ik":[8,9],"dSKZd6V9":[10],"et9M5WN3":[11]}}},"user_id":1,"description":"Look, another board!"}},{"data":{"id":6,"title":"Plan a vacation","tags":["4. Stuff I Want To Do Sheet"],"classes":["bzBMAtkd-todo_in"],"metadata":{"bzBMAtkd-todo_in":{"1lbeTjjD-priorit":"5","9o0yB8H0-why":"Need some r&r","qWTBfzKH-overvie":"- Decide on where to travel.\n- Find visa/passport requirements.\n- Find best place to stay."}},"user_id":1,"description":"Plan a vacation to Europe or Latin America."}},{"data":{"id":7,"title":"Get Promotion At Work","tags":["4. Stuff I Want To Do Sheet"],"classes":["bzBMAtkd-todo_in"],"metadata":{"bzBMAtkd-todo_in":{"1lbeTjjD-priorit":"3","9o0yB8H0-why":"I want to be able to travel and save for retirement.","qWTBfzKH-overvie":"- Figure out direction, management vs technical.\n- Look in to skills needed.\n- Do some *simple* skill research.\n- Find ways to start applying the skills now at work."}},"user_id":1,"description":"Make more money!"}},{"data":{"id":8,"title":"Burritos","tags":[],"classes":["D9p5P3hf-recipe"],"metadata":{"_kanbans":{"5":{"group":"jqvzG1ik"}},"D9p5P3hf-recipe":{"MT6vgDRj-healthi":"2","OwMMVyYR-tastine":"4","rxvZhgp9-ingredi":"- Tortillas\n- Beans\n- Meat (steak or chicken)\n- Cheese\n- Salsa"}},"user_id":1}},{"data":{"id":9,"title":"Pasta","tags":[],"classes":["D9p5P3hf-recipe"],"metadata":{"_kanbans":{"5":{"group":"jqvzG1ik"}},"D9p5P3hf-recipe":{"MT6vgDRj-healthi":"2","OwMMVyYR-tastine":"5","rxvZhgp9-ingredi":"- Noodles (spaghetti or rigatoni)\n- 2 cans tomato sauce\n- 1 can diced tomatoes\n- Ground beef or sausage","oji47V6T-recipe":"- Start boiling water\n- Cook meat\n- When meat is lightly browned, add to a different pan with tomatoes\n- When sauce is simmering, cook noodles for ~8 minutes\n- After noodles are done, remove sauce and rinse noodles"}},"user_id":1}},{"data":{"id":10,"title":"Sandwiches","tags":[],"classes":["D9p5P3hf-recipe"],"metadata":{"_kanbans":{"5":{"group":"dSKZd6V9"}},"D9p5P3hf-recipe":{"MT6vgDRj-healthi":"3","OwMMVyYR-tastine":"3","rxvZhgp9-ingredi":"- Bread\n- Meat\n- Cheese\n- Tomatoes and lettuce"}},"user_id":1}},{"data":{"id":11,"title":"Organic Kale Salad","tags":[],"classes":["D9p5P3hf-recipe"],"metadata":{"_kanbans":{"5":{"group":"et9M5WN3"}},"D9p5P3hf-recipe":{"MT6vgDRj-healthi":"5","OwMMVyYR-tastine":"1","rxvZhgp9-ingredi":"- Kale\n- Walnuts\n- Citrus Vinaigrette","oji47V6T-recipe":"Cut stuff up.\nMix it together."}},"user_id":1}}],"models":[{"data":{"id":1,"unique_id":"bzBMAtkd-todo_in","title":"Todo Info","config":{"fields":[{"id":"1lbeTjjD-priorit","title":"Prioritiy","field_type":"int","opts":{}},{"id":"9o0yB8H0-why","title":"Why","field_type":"string","opts":{}},{"id":"qWTBfzKH-overvie","title":"Overview","field_type":"text","opts":{}}]},"user_id":1}},{"data":{"id":2,"unique_id":"D9p5P3hf-recipe","title":"Recipe","config":{"fields":[{"id":"MT6vgDRj-healthi","title":"Healthiness Rating","field_type":"int","opts":{}},{"id":"OwMMVyYR-tastine","title":"Tastiness Rating","field_type":"int","opts":{}},{"id":"rxvZhgp9-ingredi","title":"Ingredients","field_type":"text","opts":{}},{"id":"oji47V6T-recipe","title":"Recipe","field_type":"markdown","opts":{}}]},"user_id":1}}]};

for (var i in b_dd.entries) {
  var ent = b_dd.entries[i];
  BrisaAPI.Entry.create(ent.data).then(function(r) {
    if (r.tags().indexOf('Important') != -1)
      Brisa.views[0].entries.push(r);
  })
}

for (var i in b_dd.models) {
  var model = b_dd.models[i];
  BrisaAPI.Model.create(model.data).then(function(r) {
    Brisa.models.push(r);
  })
}
