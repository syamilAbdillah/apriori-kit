<div class="flex flex-col">
  <div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
    <div class="py-2 inline-block min-w-full sm:px-6 lg:px-8">
      <div class="overflow-hidden">
        <table class="min-w-full">
          <slot name="colgroup"></slot>

          <slot name="head">
            <thead></thead>
          </slot>

          <slot name="body">
            <tbody></tbody>
          </slot>
        </table>
      </div>
    </div>
  </div>
</div>