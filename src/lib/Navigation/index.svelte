<script>
	import { goto } from '$app/navigation';
	import AddAlt32 from 'carbon-icons-svelte/lib/AddAlt32';
	import Avatar from '../Avatar/index.svelte';
	import IconButton from '../IconButton/index.svelte';
	import PrimaryButton from '../PrimaryButton/index.svelte';
	import { user } from '../../store/user';
	import { profile } from '../../store/profile';
	export let segment;

	function handleAdd() {
		return goto('/doc/new');
	}
</script>

<nav class="flex w-full p-2 border-t-0 border-r-0 border-b border-l-0 border-gray-300">
	<ul class="flex w-full items-center">
		<div class="logo">
			<a href="/" title="Home" id="logo" data-hveid="8">
				<img
					src="/logo_192.png"
					alt="ClassroomIO logo"
					class="rounded h-10 w-10 inline-block mx-auto mr-2"
					data-atf="1"
				/>
				<div class="hidden lg:block">
					<p>SvelteDoc</p>
					<span class="font-light">Public only note taking app</span>
				</div>
			</a>
		</div>
		<!-- <li>
			<a
				class="block"
				aria-current={segment === undefined || segment === 'dashbboard' ? 'page' : undefined}
				href="dashbboard"
			>
				All Docs
			</a>
		</li>
		<li>
			<a class="block" aria-current={segment === 'my' ? 'page' : undefined} href="courses">
				My Docs
			</a>
		</li> -->
		<span class="flex-grow" />
		{#if $user.isLoggedIn}
			<li>
				<IconButton onClick={handleAdd}>
					<AddAlt32 />
				</IconButton>
			</li>
		{/if}
		<li>
			{#if $user.isLoggedIn}
				<a
					class="block"
					aria-current={segment === 'profile' ? 'page' : undefined}
					href={`/profile/${$profile.id}`}
				>
					<Avatar src={$profile.avatar_url} name={$profile.username} className="mr-2" />
				</a>
			{:else}
				<PrimaryButton
					label="Join"
					className="py-2 px-4"
					onClick={() => ($user.openAuthModal = true)}
				/>
			{/if}
		</li>
	</ul>
</nav>

<style>
	nav {
		position: sticky;
		top: 0;
		background: #fff;
		z-index: 1;
	}
	ul {
		margin: 0 auto;
		padding: 0;
	}

	/* clearfix */
	ul::after {
		content: '';
		display: block;
		clear: both;
	}

	/* li.new-question {
    margin-top: 10px;
  } */

	a {
		text-decoration: none;
		padding: 0 1.5em;
		font-weight: 700;
		display: flex;
		align-items: center;
		flex-direction: row;
	}

	[aria-current] {
		color: #ff3e00;
		position: relative;
		display: inline-block;
	}
	[aria-current]::after {
		position: absolute;
		content: '';
		width: calc(100% - 3em);
		height: 2px;
		background-color: #ff3e00;
		display: block;
		bottom: -17px;
	}

	@media only screen and (max-width: 1002px) {
		ul {
			align-items: center;
		}
	}
</style>
