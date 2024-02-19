<template>
  <div
    class="h-screen max-w-screen flex flex-col justify-evenly items-center gap-4"
  >
    <UCard>
      <section class="flex flex-col gap-4">
        <h2 class="font-bold">Sign Ip</h2>
        <UForm
          :state="signInData"
          @submit="signIn()"
          class="flex flex-col gap-4"
        >
          <UFormGroup label="Email">
            <UInput type="text" v-model="signInData.email" />
          </UFormGroup>

          <UFormGroup label="Password">
            <UInput type="password" v-model="signInData.password" />
          </UFormGroup>

          <UButton type="submit" label="Sign in" block />
        </UForm>
      </section>

      Don't have an account? Sign-up
      <NuxtLink to="/auth/sign-up"> here </NuxtLink>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const signInData = reactive({
  email: undefined,
  password: undefined
})

const signIn = async () => {
  const { data, error } = await useFetch('/api/auth/sign-in', {
    method: 'POST',
    body: signInData
  })
}
</script>
