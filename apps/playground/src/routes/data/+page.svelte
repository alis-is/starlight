<script lang="ts">
	import { Input, List, DataGrid, Pagination } from '@alis-is/starlight';
	import type { DataGridColumn } from '@alis-is/starlight';

	let page = $state(3);

	let todos = $state(['Write docs', 'Ship v0.1', 'Star the repo']);

	type Person = { id: number; name: string; role: string; age: number };
	const people: Person[] = [
		{ id: 1, name: 'Ada Lovelace', role: 'Engineer', age: 36 },
		{ id: 2, name: 'Alan Turing', role: 'Researcher', age: 41 },
		{ id: 3, name: 'Grace Hopper', role: 'Admiral', age: 85 },
		{ id: 4, name: 'Katherine Johnson', role: 'Mathematician', age: 101 }
	];
	const columns: DataGridColumn<Person>[] = [
		{ key: 'name', label: 'Name', sortable: true, filterable: true },
		{ key: 'role', label: 'Role', sortable: true, filterable: true },
		{ key: 'age', label: 'Age', sortable: true, align: 'right' }
	];
	let gridFilter = $state('');
	let selected = $state<Person[]>([]);
</script>

<div class="demo-page">
	<h1>Data</h1>

	<section data-testid="section-list">
		<h2>List (searchable + add)</h2>
		<div class="boxed">
			<List
				bind:items={todos}
				addable
				onadd={(t) => (todos = [...todos, t])}
				onremove={(_, i) => (todos = todos.filter((_, j) => j !== i))}
				searchPlaceholder="Filter todos…"
				addPlaceholder="New todo…"
			/>
		</div>
		<p class="result">count=<span data-testid="todo-count">{todos.length}</span></p>
	</section>

	<section data-testid="section-grid">
		<h2>DataGrid</h2>
		<div class="row">
			<Input label="Filter" bind:value={gridFilter} />
		</div>
		<div class="boxed">
			<DataGrid
				data={people}
				{columns}
				filter={gridFilter}
				selectMode="multiple"
				rowKey={(p) => p.id}
				bind:selected
			/>
		</div>
		<p class="result">selected=<span data-testid="grid-selected">{selected.length}</span></p>
	</section>

	<section data-testid="section-pagination">
		<h2>Pagination</h2>
		<Pagination bind:page total={124} perPage={10} />
		<p class="result">page={page}</p>
	</section>
</div>
