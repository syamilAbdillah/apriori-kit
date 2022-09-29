<script>
  import { afterNavigate } from '$app/navigation'
  import Navbar from '$lib/Navbar.svelte'
  import NavbarItem from '$lib/NavbarItem.svelte'
  import Sidebar from '$lib/Sidebar.svelte'
  import SidebarItem from '$lib/SidebarItem.svelte'
  import Avatar from '$lib/Avatar.svelte'

  let open = false
  afterNavigate(() => open = false)
  const drawerId = 'my-drawer-3'

  const menu = [
    {label: 'data penjualan', href: '/'},
    {label: 'data produk', href: '/produk'},
    {label: 'data pengguna', href: '/pengguna'},
    {label: 'analisa apriori', href: '/apriori'},
  ]
</script>

<div class="drawer bg-base-200">
  <input id={drawerId} bind:checked={open} type="checkbox" class="drawer-toggle" /> 
  <div class="drawer-content flex flex-col">
    <!-- navbar -->
    <Navbar {drawerId}>
      <svelte:fragment slot="title">
        <Avatar src="/logo.jpeg" alt="logo perusahaan" slot="title" />
      </svelte:fragment>
      <svelte:fragment slot="item">
        {#each menu as item, index}
          <NavbarItem href={item.href}>{item.label}</NavbarItem>
        {/each}
      </svelte:fragment>
      <form slot="logout" action="/logout" method="POST" class="inline-flex">
        <input type="hidden" name="action" value="delete">
        <button class="btn" type="submit">logout</button>
      </form>
    </Navbar>

    <main class="container mx-auto">
      <!-- ######### MAIN CONTENT HERE !! ######### -->
      <div class="px-4 pt-20 pb-4 min-h-screen">
        <slot></slot>
      </div>
    </main>

    <footer class="py-6 px-4 border">
      <div class="container mx-auto flex justify-between items-center">
        <span class="text-gray-400 font-thin text-xs">Sistem informasi penjualan pada Piala Liemo’s Trophy menggunakan algoritma Apriori</span>
        <span class="text-gray-400 text-sm font-thin">NAMA | NIM</span>
      </div>
    </footer>
  </div>

  <!-- sidebar -->
  <Sidebar {drawerId} >
    <svelte:fragment slot="title">
      <Avatar src="/logo.jpeg" alt="logo perusahaan" slot="title" />
    </svelte:fragment>
    <svelte:fragment slot="item">
      {#each menu as item, index}
        <SidebarItem href={item.href}>{item.label}</SidebarItem>
      {/each}
    </svelte:fragment>
    <form slot="logout" action="/logout" method="POST" class="inline-flex">
      <input type="hidden" name="action" value="delete">
      <button type="submit">logout</button>
    </form>
  </Sidebar>

</div>