<!-- This component is responsible for displaying created notes and allowing the user to create new ones via the upper text field -->
<script>
	import { uid, notesStore, trashStore } from "./store.js";
	import { clickOutside } from "./clickOutside.js";
	import { slide } from "svelte/transition";
	let visible = false;

	let tempTitle = "";
	let tempContent = "";
	let defaultColor = "#FFFFFF";

	const handleClickOutside = () => {
		if (visible === true) {
			visible = false;
		}

		if (tempContent || tempTitle) {
			addNote();
		}
	}

	const addNote = () => {
		const newNote = {
			id: $uid++,
			title: tempTitle,
			content: tempContent,
			background: defaultColor,
		};
		$notesStore = [newNote, ...$notesStore];

		tempContent = "";
		tempTitle = "";
	}

	const saveEdits = (id) => {
		const title = document.querySelector("#_" + id + " .note-title");
		const content = document.querySelector("#_" + id + " .note-content");

		for (let i = 0; i < $notesStore.length; i++) {
			if ($notesStore[i].id === id) {
				if (content) {
					if (content.innerHTML.trim().length === 0) {
						content.innerHTML = " ";
					}
					$notesStore[i].content = content.innerHTML;
				}
				if (title) {
					if (title.innerHTML.trim().length === 0) {
						title.innerHTML = " ";
					}
					$notesStore[i].title = title.innerHTML;
				}
				break;
			}
		}
		edit = false;

		const payload = document.querySelector("#_" + id);
		payload.parentElement.setAttribute("draggable", "true");

		if (title) {
			title.contentEditable = "false";
			if (title.innerHTML.trim().length === 0) {
				title.style = "cursor: default; display:none";
			} else {
				title.style = "cursor: default;";
			}
		}

		if (content) {
			content.contentEditable = "false";
			if (content.innerHTML.trim().length === 0) {
				content.style = "cursor: default;";
			} else {
				content.style = "cursor: default;";
			}
		}
	}

	const editNote = (id) => {
		for (let note of $notesStore) {
			if (note.id === id) {
				const title = document.querySelector(
					"#_" + note.id + " .note-title"
				);
				const content = document.querySelector(
					"#_" + note.id + " .note-content"
				);
				edit = true;

				if (title) {
					if (title.innerHTML.trim().length === 0) {
						title.innerHTML = "";
					} else {
						moveCursorAtTheEnd(title);
					}
					title.contentEditable = "true";
					title.style = "cursor: text";
				}

				if (content) {
					if (content.innerHTML.trim().length === 0) {
						content.innerHTML = "";
					} else {
						moveCursorAtTheEnd(content);
					}
					content.contentEditable = "true";
					content.style = "cursor: text";
					content.focus();
				}

				const payload = document.querySelector("#_" + note.id);
				payload.parentElement.setAttribute("draggable", "false");
				payload.addEventListener(
					"click_outside",
					() => saveEdits(note.id),
					{ once: true }
				);

				break;
			}
		}
	}

	const editColor = (e, id) => {
		const colorPicked = e.target.value;

		for (let i = 0; i < $notesStore.length; i++) {
			if ($notesStore[i].id === id) {
				$notesStore[i].background = colorPicked;
				break;
			}
		}
	}

	const moveNoteToTrash = (id) => {
		for (let note of $notesStore) {
			if (note.id === id) {
				//MOVES NOTE TO TRASH ARRAY
				$trashStore = [note, ...$trashStore];

				//DELETE NOTE FROM NOTES ARRAY
				$notesStore = $notesStore.filter((n) => n !== note);
				break;
			}
		}
	}

	const moveCursorAtTheEnd = (contenteditable) => {
		const selection = document.getSelection();
		const range = document.createRange();

		if (contenteditable.lastChild.nodeType === 3) {
			range.setStart(
				contenteditable.lastChild,
				contenteditable.lastChild.length
			);
		} else {
			range.setStart(contenteditable, contenteditable.childNodes.length);
		}
		selection.removeAllRanges();
		selection.addRange(range);
	}

	let mouseXCoordinate = null;
	let mouseYCoordinate = null; 
	let distanceTopGrabbedVsPointerX = null;
	let distanceTopGrabbedVsPointerY = null;
	let showGhost = false;
	let draggingItem = null;
	let draggingItemId = null;
	let draggingItemIndex = null;
	let edit = false;
	let hoveredItemIndex = null;

	$: {
		if (
			draggingItemIndex !== null &&
			hoveredItemIndex !== null &&
			draggingItemIndex !== hoveredItemIndex
		) {
			// swap items
			[$notesStore[draggingItemIndex], $notesStore[hoveredItemIndex]] = [
				$notesStore[hoveredItemIndex],
				$notesStore[draggingItemIndex],
			];

			// balance
			draggingItemIndex = hoveredItemIndex;
		}
	}
</script>

<div
	class="container"
	use:clickOutside
	on:click_outside={handleClickOutside}
	in:slide={{ duration: 550 }}
	out:slide={{ duration: 350 }}
>
	{#if visible}
		<div
			class="new-note-title"
			contenteditable="true"
			bind:innerHTML={tempTitle}
			data-placeholder="Title"
		/>
	{/if}
	<!-- svelte-ignore a11y-autofocus -->
	<div
		class="new-note-content"
		contenteditable="true"
		bind:innerHTML={tempContent}
		data-placeholder="Take a note..."
		tabindex="-1"
		autofocus
		on:input={() => {
			visible = true;
		}}
		on:click={() => visible = true}
		on:keydown={() => {}}
	/>
</div>

<div class="note-container" on:dragover={(e) => {e.preventDefault(); e.dataTransfer.dropEffect="move"}}>
	{#if showGhost && mouseYCoordinate && mouseXCoordinate}
		<div
			class="note ghost"
			style="top: {mouseYCoordinate + distanceTopGrabbedVsPointerY}px; 
			   left: {mouseXCoordinate +
				distanceTopGrabbedVsPointerX}px; background: {draggingItem.background};"
		>
			<div class="note-payload" id="_{draggingItem.id}" use:clickOutside>
				<div
					class="note-title"
					style={draggingItem.title.trim().length === 0
						? "display:none"
						: "display:block"}
					data-placeholder="Title"
				>
					{@html draggingItem.title}
				</div>
				<div
					class="note-content"
					style={draggingItem.content.trim().length === 0
						? "display:none"
						: "display:block"}
					data-placeholder="Take a note..."
				>
					{@html draggingItem.content}
				</div>
			</div>
			<div class="note-options" />
		</div>
	{/if}
	{#each $notesStore as note, i (note.id)}
		<div
			class="note {draggingItemId == note.id ? 'invisible' : ''}"
			style="background-color: {note.background}"
			draggable="true"
			in:slide={{ duration: 550 }}
			out:slide={{ duration: 350 }}
			on:dragstart={(e) => {
				if (!edit) {
					mouseXCoordinate = e.clientX;
					mouseYCoordinate = e.clientY;
					showGhost = true;

					draggingItem = note;
					draggingItemIndex = i;
					draggingItemId = note.id;

					distanceTopGrabbedVsPointerX =
						e.target.getBoundingClientRect().x +
						window.scrollX -
						e.clientX;
					distanceTopGrabbedVsPointerY =
						e.target.getBoundingClientRect().y +
						window.scrollY -
						e.clientY;
				}
			}}
			on:drag={(e) => {
				if (!edit) {
					mouseXCoordinate = e.clientX;
					mouseYCoordinate = e.clientY;
				}
			}}
			on:dragover={(e) => {
				e.preventDefault();7
				e.dataTransfer.dropEffect="move";
				if (!edit) {
					hoveredItemIndex = i;
				}
				
			}}
			on:dragend={(e) => {
				if (!edit) {
					mouseXCoordinate = e.clientX;
					mouseYCoordinate = e.clientY;

					showGhost = false;
					draggingItemId = null; // MAKES ITEM INVISIBLE
					hoveredItemIndex = null; // PREVENTS INSTANT SWAP
				}
			}}
		>
			<div class="note-payload" id="_{note.id}" use:clickOutside>
				<div
					class="note-title"
					style={note.title.trim().length === 0
						? "display:none"
						: "display:block"}
					data-placeholder="Title"
				>
					{@html note.title}
				</div>
				<div
					class="note-content"
					style={note.content.trim().length === 0
						? "display:none"
						: "display:block"}
					data-placeholder="Take a note..."
				>
					{@html note.content}
				</div>
			</div>
			<div class="note-options">
				<button class="note-edit" on:click={() => editNote(note.id)}>
					<img
						style="width: 1.25rem; height: 1.25rem;"
						src="img/pencil.png"
						alt="edit note"
						title="Edit"
					/>
				</button>
				<div
					class="btn"
					style="position:relative; display:inline-block"
				>
					<img
						style="width: 1.25rem; 
							   height: 1.25rem; 
							   left: 4px;
							   position: absolute;
							   top: 4px;"
						src="img/colors.png"
						alt="change the color of the note"
						title="Pick a color"
					/>
					<input
						type="color"
						style="opacity:0;position:absolute;left:0;top:0;width:100%;height:100%"
						name="color-picker"
						title="Pick a color"
						value={note.background}
						class="note-color-edit"
						on:input={(event) => editColor(event, note.id)}
					/>
				</div>
				<button
					class="note-move-to-trash"
					on:click={() => moveNoteToTrash(note.id)}
				>
					<img
						style="width: 1.25rem; height: 1.25rem;"
						src="img/trash.png"
						alt="move to trash note"
						title="Move to trash"
					/>
				</button>
			</div>
		</div>
	{/each}
</div>

<style>
	div.container {
		margin: auto auto 40px auto;
		max-width: 300px;
		width: auto;
		border-color: #e0e0e0;
		box-shadow: 0 1px 2px 0 rgb(60 64 67 / 30%),
			0 2px 6px 2px rgb(60 64 67 / 15%);
		border-radius: 8px;
		font-size: 16px;
	}

	div.new-note-title {
		font-family: "Google Sans", Roboto, Arial, sans-serif;
		overflow: hidden;
		margin: auto;
		padding: 15px;
		border-radius: 8px;
		font-weight: 500;
		letter-spacing: 0.00625em;
	}

	div.new-note-content {
		font-family: Roboto, Arial, sans-serif;
		overflow: hidden;
		margin: auto;
		padding: 15px;
		font-weight: 400;
		letter-spacing: 0;
	}

	div.new-note-title:focus,
	div.new-note-content:focus {
		outline: #e0e0e0;
	}

	div.note-container {
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-start;
		gap: 15px 20px;
		margin-left: 110px;
	}

	div.note-title {
		font-family: "Google Sans", Roboto, Arial, sans-serif;
		margin: 0;
		padding: 12px 16px 0 16px;
		font-weight: 500;
		letter-spacing: 0.00625em;
	}

	div.note-content {
		font-family: Roboto, Arial, sans-serif;
		margin: 0;
		padding: 12px 16px 0 16px;
		font-weight: 400;
		letter-spacing: 0;
	}

	div.note-payload div {
		outline: 0;
	}

	div.note-options {
		display: flex;
		justify-content: space-around;
		height: 32px;
		margin: 6px 0;
	}

	div.note-options button,
	div.note-options .btn {
		margin: 0;
		padding: 0;
		background-color: transparent;
		border: none;
		opacity: 0;
		transition: opacity 0.3s;
		width: 30px;
		height: 30px;
		border-radius: 99px;
		padding-top: 1px;
	}

	div.note:hover div.note-options button {
		opacity: 0.8;
	}

	div.note:hover div.note-options .btn {
		opacity: 0.9;
	}

	div.note-options button:hover {
		opacity: 0.87;
		background-color: rgba(95, 99, 104, 0.157);
	}

	div.note-options .btn:hover {
		opacity: 0.87;
		background-color: rgba(95, 99, 104, 0.157);
	}

	div.note-options button:active {
		opacity: 0.87;
		background-color: rgba(40, 43, 45, 0.157);
	}

	div.note-options .btn:active {
		opacity: 0.87;
		background-color: rgba(40, 43, 45, 0.157);
	}

	div.note-payload {
		min-height: 60px;
		line-height: 22px;
	}

	div.note {
		cursor: default;
		vertical-align: top;
		width: 240px;
		height: 100%;
		display: inline-block;
		border: 1px solid #e0e0e0;
		border-radius: 8px;
		padding: 0;
		margin: 0;
		box-sizing: border-box;
		font-variant-ligatures: none;
		outline: none;
		word-wrap: break-word;
		line-height: 15px;
		box-shadow: none;
	}

	div.note:hover {
		box-shadow: 3px 8px 8px #888888;
	}

	div:empty:before {
		content: attr(data-placeholder);
		color: gray;
		cursor: text;
	}

	.ghost {
		margin-bottom: 10px;
		pointer-events: none;
		z-index: 99;
		position: absolute;
		top: 0;
		left: 10;
		height: auto !important;
		opacity: 1;
		cursor: move;
		cursor: grab;
		cursor: -moz-grab;
		cursor: -webkit-grab;
	}

	.invisible {
		opacity: 0;
	}

	@media (min-width: 720px) {
		.note-container{
			gap: 25px 20px!important;
		}

		div.container{
			max-width: 600px;
		}
	}
</style>
