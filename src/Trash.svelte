<script>
	import { notesStore, trashStore } from "./store";
	import { flip } from "svelte/animate";

	const restoreNote = (id) => {
		for (let note of $trashStore) {
			if (note.id === id) {
				//RESTORE NOTE
				$notesStore = [note, ...$notesStore];
				//DELETE NOTE FROM TRASH
				$trashStore = $trashStore.filter((n) => n !== note);
				break;
			}
		}
	}

	const deleteNote = (id) => {
		for (let note of $trashStore) {
			if (note.id === id) {
				//DELETE NOTE FROM TRASH ARRAY
				$trashStore = $trashStore.filter((n) => n !== note);
				break;
			}
		}
	}

	const deleteAll = () => {
		if ($trashStore) {
			if (confirm("Are you sure?")) {
				$trashStore = [];
			}
		}
	}
</script>

<div class="container">
	<h1>Trash</h1>
	<button class="empty-trash-btn" on:click={deleteAll}
		><h3>empty trash</h3></button>
</div>

<div class="note-container">
	{#each $trashStore as trashNote (trashNote.id)}
		<div
			class="note"
			style="background-color: {trashNote.background}"
			animate:flip={{ duration: 200 }}
		>
			<div class="note-payload">
				{#if trashNote.title}
					<div class="note-title">{@html trashNote.title}</div>
				{/if}
				{#if trashNote.content}
					<div class="note-content">{@html trashNote.content}</div>
				{/if}
			</div>
			<div class="note-options">
				<button
					class="note-restore"
					on:click={() => restoreNote(trashNote.id)}
				>
					<img
						style="width: 1.25rem; height: 1.25rem;"
						src="img/restore.png"
						alt="restore note"
						title="Restore"
					/>
				</button>
				<button
					class="note-move-to-trash"
					on:click={() => deleteNote(trashNote.id)}
				>
					<img
						style="width: 1.25rem; height: 1.25rem;"
						src="img/delete.png"
						alt="delete note"
						title="Delete"
					/>
				</button>
			</div>
		</div>
	{/each}
</div>

<style>
	h1,
	h3 {
		font-family: "Google Sans", Roboto, Arial, sans-serif;
		margin: 0;
	}
	div.container {
		text-align: center;
	}
	div.note-container {
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-start;
		gap: 10px 20px;
		margin-left: 100px;
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

	div.note-options {
		display: flex;
		justify-content: space-around;
		height: 32px;
		margin: 6px 0;
	}

	.note-options button {
		margin: 0;
		padding: 0;
		background-color: transparent;
		border: none;
		opacity: 0;
		transition: opacity 0.3s;
		width: 100%;
		height: 100%;
		border-radius: 999px;
		padding-top: 2px;
	}

	div.note:hover div.note-options button {
		opacity: 0.8;
	}

	div.note-options button:hover {
		opacity: 0.87;
		background-color: rgba(95, 99, 104, 0.157);
	}

	div.note-options button:active {
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

	button.empty-trash-btn {
		background-color: transparent;
		border: none;
		color: #1a73e8;
		border-radius: 8px;
		margin-top: 10px;
	}

	button.empty-trash-btn:hover {
		background-color: rgba(66, 133, 244, 0.039);
	}

	button.empty-trash-btn:active {
		background-color: rgba(66, 133, 244, 0.161) !important;
	}
</style>