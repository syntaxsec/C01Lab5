test("1+2=3, empty array is empty", () => {
    expect(1 + 2).toBe(3);
    expect([].length).toBe(0);
});

const SERVER_URL = "http://localhost:4000";

test("/postNote - Post a note", async () => {
  const title = "NoteTitleTest";
  const content = "NoteTitleContent";

  const postNoteRes = await fetch(`${SERVER_URL}/postNote`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: title,
      content: content,
    }),
  });

  const postNoteBody = await postNoteRes.json();

  expect(postNoteRes.status).toBe(200);
  expect(postNoteBody.response).toBe("Note added succesfully.");
});



test("/getAllNotes - Return list of zero notes for getAllNotes", async () => {
  // Clean up:
  await fetch(`${SERVER_URL}/deleteAllNotes`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json", },
  });

const getAllNotesRes = await fetch(`${SERVER_URL}/getAllNotes`);
const getAllNotesBody = await getAllNotesRes.json();
expect(getAllNotesRes.status).toBe(200);
expect(getAllNotesBody.response).toEqual([]);
});



test("/getAllNotes - Return list of two notes for getAllNotes", async () => {

  for (let i = 0; i < 2; i++) {
    await fetch(`${SERVER_URL}/postNote`, {
      method: "POST",
      headers: { "Content-Type": "application/json", },

      body: JSON.stringify({
        title: 'test',
        content: 'test',
      }),

    });
  }

  const getAllNotesRes = await fetch(`${SERVER_URL}/getAllNotes`);
  const getAllNotesBody = await getAllNotesRes.json();
  expect(getAllNotesRes.status).toBe(200);
  expect(getAllNotesBody.response.length).toBe(2);


  // Cleanup:
  const deleteAllNotesRes = await fetch(`${SERVER_URL}/deleteAllNotes`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json", },
  });
  
});



test("/deleteNote - Delete a note", async () => {

  const postNoteRes = await fetch(`${SERVER_URL}/postNote`, {
    method: "POST",
    headers: { "Content-Type": "application/json", },
    body: JSON.stringify({
      title: 'deleteNote test 1',
      content: 'This note should be deleted. It should be the only one deleted',
    }),
  });

  const postNoteBody = await postNoteRes.json();

  // Prevent errors from postNote from ruining this test:
  if (postNoteRes.status != 200) { expect(true).toBe(false); }

  const noteId = postNoteBody.insertedId;

  const deleteNoteRes = await fetch(`${SERVER_URL}/deleteNote/${noteId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json", },
  });

  const deleteNoteBody = await deleteNoteRes.json();
  expect(deleteNoteRes.status).toBe(200);
  expect(deleteNoteBody.response).toBe(`Document with ID ${noteId} deleted.`);

  // Cleanup:
  const deleteAllNotesRes = await fetch(`${SERVER_URL}/deleteAllNotes`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json", },
  });

});



test("/patchNote - Patch with content and title", async () => {
  // need to make independent of other tests:
  const postNoteRes = await fetch(`${SERVER_URL}/postNote`, {
    method: "POST",
    headers: { "Content-Type": "application/json", },
    body: JSON.stringify({
      title: 'patchNote test 1.',
      content: 'The content of this note will change.',
    }),
  });

  const postNoteBody = await postNoteRes.json();

  // Prevent errors from postNote from ruining this test:
  if (postNoteRes.status != 200) { expect(true).toBe(false); }

  const noteId = postNoteBody.insertedId;

  const patchNoteRes = await fetch(`${SERVER_URL}/patchNote/${noteId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", },

    body: JSON.stringify({
      title: 'Successfully changed',
      content: 'Successfully changed.',
    }),

  });

  const patchNoteBody = await patchNoteRes.json();
  expect(patchNoteRes.status).toBe(200);
  expect(patchNoteBody.response).toBe(`Document with ID ${noteId} patched.`);

  // Cleanup:
  const deleteAllNotesRes = await fetch(`${SERVER_URL}/deleteAllNotes`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json", },
  });

});



test("/patchNote - Patch with just title", async () => {
  const postNoteRes = await fetch(`${SERVER_URL}/postNote`, {

    method: "POST",
    headers: { "Content-Type": "application/json", },

    body: JSON.stringify({
      title: 'PatchNote test 2',
      content: 'test',
    }),

  });

  const postNoteBody = await postNoteRes.json();

  // Prevent errors from postNote from ruining this test:
  if (postNoteRes.status != 200) { expect(true).toBe(false); }

  const noteId = postNoteBody.insertedId;

  const patchNoteRes = await fetch(`${SERVER_URL}/patchNote/${noteId}`, {

    method: "PATCH",
    headers: {"Content-Type": "application/json",},

    body: JSON.stringify( {title: 'Modified Title',} ),

  });

  const patchNoteBody = await patchNoteRes.json();

  expect(patchNoteRes.status).toBe(200);
  expect(patchNoteBody.response).toBe(`Document with ID ${noteId} patched.`);

  // Cleanup:
  const deleteAllNotesRes = await fetch(`${SERVER_URL}/deleteAllNotes`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json", },
  });

});



test("/patchNote - Patch with just content", async () => {

  const postNoteRes = await fetch(`${SERVER_URL}/postNote`, {

    method: "POST",
    headers: { "Content-Type": "application/json", },

    body: JSON.stringify({
      title: 'test',
      content: 'test',
    }),

  });

  const postNoteBody = await postNoteRes.json();

  // Prevent errors from postNote from ruining this test:
  if (postNoteRes.status != 200) { expect(true).toBe(false); }

  const noteId = postNoteBody.insertedId;

  const patchNoteRes = await fetch(`${SERVER_URL}/patchNote/${noteId}`, {

    method: "PATCH",
    headers: { "Content-Type": "application/json", },

    body: JSON.stringify( {content: 'Modified Title.',} ),

  });

  // Cleanup:
  const deleteAllNotesRes = await fetch(`${SERVER_URL}/deleteAllNotes`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json", },
  });

});



test("/deleteAllNotes - Delete one note", async () => {

  await fetch(`${SERVER_URL}/deleteAllNotes`, {

    method: "DELETE",
    headers: {"Content-Type": "application/json",},

  });

  await fetch(`${SERVER_URL}/postNote`, {

    method: "POST",
    headers: { "Content-Type": "application/json", },

    body: JSON.stringify({
      title: 'Sacrificial',
      content: 'Lamb',
    }),

  });

  // Do we care if the post fails??
  
  const deleteAllNotesRes = await fetch(`${SERVER_URL}/deleteAllNotes`, {

    method: "DELETE",
    headers: {"Content-Type": "application/json",},

  });

  const deleteAllNotesBody = await deleteAllNotesRes.json();
  expect(deleteAllNotesRes.status).toBe(200);
  expect(deleteAllNotesBody.response).toBe("1 note(s) deleted.");

});



test("/deleteAllNotes - Delete three notes", async () => {

  for (let i = 0; i < 3; i++) {

    await fetch(`${SERVER_URL}/postNote`, {
      method: "POST",
      headers: {"Content-Type": "application/json",},

      body: JSON.stringify({
        title: 'test',
        content: 'test',
      }),

    });
  }

const deleteAllNotesRes = await fetch(`${SERVER_URL}/deleteAllNotes`, {
  method: "DELETE",
  headers: { "Content-Type": "application/json", },
});

const deleteAllNotesBody = await deleteAllNotesRes.json();

expect(deleteAllNotesRes.status).toBe(200);
expect(deleteAllNotesBody.response).toBe("3 note(s) deleted.");
  
});



test("/updateNoteColor - Update color of a note to red (#FF0000)", async () => {

  const postNoteRes = await fetch(`${SERVER_URL}/postNote`, {

    method: "POST",
    headers: { "Content-Type": "application/json", },

    body: JSON.stringify({
      title: 'test',
      content: 'test',
    }),

  });

  const postNoteBody = await postNoteRes.json();

  const noteId = postNoteBody.insertedId;

  const updateNoteColorRes = await fetch(`${SERVER_URL}/updateNoteColor/${noteId}`, {

    method: "PATCH",
    headers: { "Content-Type": "application/json", },

    body: JSON.stringify({
      color: "#FF0000",
    }),

  });

  const updateNoteColorBody = await updateNoteColorRes.json();
  expect(updateNoteColorRes.status).toBe(200);
  expect(updateNoteColorBody.message).toBe("Note color updated successfully.");

});