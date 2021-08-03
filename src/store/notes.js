import { writable } from 'svelte/store';

export const notes = writable([
	{
		title: 'Things we can buy in the office',
		content: '',
		isActive: true
	},
	{
		title: 'How to be the best?',
		content: '',
		isActive: false
	}
]);

export const changeIsActive = (noteIndex) => {
	notes.update((_notes) => {
		return _notes.map((note, index) => {
			if (noteIndex === index) note.isActive = true;
			else note.isActive = false;

			return note;
		});
	});
};

export const deleteNote = (noteIndex) => {
	notes.update((_notes) => {
		return _notes.filter((note, index) => noteIndex !== index);
	});
};

export const addNote = () => {
	notes.update((_notes) => {
		return [
			..._notes,
			{
				title: 'Untitled',
				content: '',
				isActive: false
			}
		];
	});
};
