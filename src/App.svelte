<!-- Main component of the app. It consists of the sidebar and page content -->
<!-- University project for final report carried out during external internship -->
<script>
	import Notes from "./Notes.svelte";
	import Trash from "./Trash.svelte";
	let page = Notes;
</script>

<main>
	<nav class="sidebar">
		<button
			id="notes-btn"
			class:active={page == Notes}
			class="menu-btn"
			on:click={() => (page = Notes)}
			><img
				style="width: 2rem; height: 2rem;"
				src="/img/notes.png"
				alt="your notes"
			/></button
		>
		<button
			id="trash-btn"
			class:active={page == Trash}
			class="menu-btn"
			on:click={() => (page = Trash)}
			><img
				style="width: 2rem; height: 2rem;"
				src="/img/trash.png"
				alt="trash"
			/></button
		>
	</nav>
	<svelte:component this={page} />
</main>

<style>
	main {
		background-color: #ffffff;
		color: #202124;
		font-family: "Roboto", arial, sans-serif;
		padding: 1em;
		max-width: 550px;
		margin: 0 auto;
	}

	nav.sidebar {
		display: flex;
		justify-content: space-around;
		flex-direction: column;
		position: fixed;
		left: 0;
		z-index: 50;
		height: 100%;
		padding-left: 2rem;
	}

	.menu-btn {
		border: none;
		background-color: #F5F5F5;
		border-radius: 999px;
		opacity: 0.8;
		padding: 10px;
	}

	.menu-btn:hover {
		background-color: #f1f3f4;
	}

	.menu-btn:active {
		background-color: #e8e8e8;
	}

	.menu-btn.active {
		background-color: #feefc3;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
