<script>
  export let drawerId
</script>
<div class="w-full fixed inset-x-0 top-0 z-50 bg-primary text-primary-content rounded-b-lg">
  <div class="navbar gap-4 container mx-auto">
    <slot name="title">
      <div class="flex-none px-2 mx-2">Navbar Title</div>
    </slot>
    <div class="flex-1 flex justify-end lg:hidden">
      <label for={drawerId} class="btn btn-square btn-ghost">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-6 h-6 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
      </label>
    </div> 
    <div class="flex-1 hidden lg:block">
      <ul class="menu menu-horizontal">
        <!-- Navbar menu content here -->
        <slot name="item"/>
      </ul>
    </div>
    <div class="flex-none hidden lg:block">
      <slot name="logout" />
    </div>
  </div>
</div>