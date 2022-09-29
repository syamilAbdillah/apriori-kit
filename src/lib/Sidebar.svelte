<script>
  export let drawerId
</script>

<div class="drawer-side">
  <label for={drawerId} class="drawer-overlay"></label> 
  <ul class="menu p-4 overflow-y-auto w-64 bg-primary text-primary-content">
    <!-- Sidebar content here -->
    <div class="flex justify-center my-6">
      <slot name="title"></slot>
    </div>
    <slot name="item">
      <li><a href="/">Sidebar Item 1</a></li>
      <li><a href="/">Sidebar Item 2</a></li>
    </slot>
    <li>
      <slot name="logout"></slot>
    </li>
  </ul>
</div>