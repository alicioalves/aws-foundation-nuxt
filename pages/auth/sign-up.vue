<template>
  <div
    class="h-screen max-w-screen flex flex-col justify-evenly items-center gap-4"
  >
    <UCard>
      <section class="flex flex-col gap-4">
        <h2 class="font-bold">Sign Up</h2>
        <UForm
          :state="signUpData"
          @submit="signUp()"
          class="flex flex-col gap-4"
        >
          <UFormGroup label="Name">
            <UInput type="text" v-model="signUpData.name" />
          </UFormGroup>

          <UFormGroup label="Email">
            <UInput type="text" v-model="signUpData.email" />
          </UFormGroup>

          <UFormGroup label="Password">
            <UInput type="password" v-model="signUpData.password" />
          </UFormGroup>

          <UFormGroup label="Confirm Password">
            <UInput type="password" v-model="signUpData.confirmPassword" />
          </UFormGroup>

          <UButton type="submit" label="Sign up" block />
        </UForm>
      </section>
      Already have an account? Sign-in
      <NuxtLink to="/auth/sign-in"> here </NuxtLink>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const signUpData = reactive({
  name: undefined,
  email: undefined,
  password: undefined,
  confirmPassword: undefined
})

const signUp = async () => {
  const { data, error } = await useFetch('/api/auth/sign-up', {
    method: 'POST',
    body: signUpData
  })
}
</script>
