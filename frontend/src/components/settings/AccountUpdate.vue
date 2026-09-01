<template>
  <div class="flex justify-content-center align-items-center w-full h-full">
    <Toast />
    
    <Card class="w-full surface-50">
        <template #title>Update an Account</template>
        <template #subtitle>
            <p class="mb-4 text-surface-500">Update your personal information such as name, email address, and profile picture.</p>
        </template>

        <template #content>
            <Form v-slot="$form" :initialValues="initialValues" :resolver="resolver" @submit="onFormSubmit" class="flex flex-column gap-4 w-full max-w-sm">
                <FormField name="firstName" class="flex flex-column gap-1" v-slot="$field">
                    <label for="firstname" class="font-medium">First Name</label>
                    <InputText id="firstname" type="text" placeholder="First Name" fluid />
                    <Message v-if="$field?.error" severity="error" variant="simple" size="small">
                        {{ $field.error.message }}
                    </Message>
                </FormField>

                <FormField name="lastName" class="flex flex-column gap-1" v-slot="$field">
                    <label for="lastname" class="font-medium">Last Name</label>
                    <InputText id="lastname" type="text" placeholder="Last Name" fluid />
                    <Message v-if="$field?.error" severity="error" variant="simple" size="small">
                        {{ $field.error.message }}
                    </Message>
                </FormField>

                <div class="flex justify-content-end">
                    <Button type="submit" severity="primary">
                        <Spinner v-if="loading" spin/>
                        Save Changes
                    </Button>
                </div>
            </Form>
        </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
    import { ref, computed } from 'vue'
    import { z } from 'zod'
    import { zodResolver } from '@primevue/forms/resolvers/zod'
    import { useToast } from 'primevue/usetoast'
    import type { FullNameFormValues, FormSubmitEvent } from '@/types/Form.types'
    import { useApi } from '@/composables/useApi'
    import { UserService } from '@/services/UserService'
    import { useUserStore } from '@/stores/userStore'

    const toast = useToast()
    const { loading, error, execute } = useApi()
    const userStore = useUserStore()

    // Define the initial state of the registration form
    // Setting as computed so ZOD can validate the form values and set the initial values of the form fields based on the current user data. 
    // This ensures that the form is pre-populated with the user's existing information, allowing for a seamless update experience.
    const initialValues = computed<FullNameFormValues>(() => ({
        firstName: userStore.getUser?.firstName ?? '',
        lastName: userStore.getUser?.lastName ?? ''
    }))

    // Define the validation rules using Zod
    const updateFullNameSchema = z.object({
        firstName: z.string().min(2, { message: 'First name must be at least 2 characters long.' }),
        lastName: z.string().min(2, { message: 'Last name must be at least 2 characters long.' })
    })

    // Create the resolver
    const resolver = ref(zodResolver(updateFullNameSchema))

    // Handle form submission
    const onFormSubmit = async (e: FormSubmitEvent) => {
        const userId = userStore.getUser?.id

        if (!userId) {
            toast.add({ severity: 'error', summary: 'Account update Failed', detail: 'User ID is missing.', life: 5000 })
            return
        }
        
        if (e.valid) {
            try {
                const user = await execute(() => UserService.updateUser({ id: userId, ...e.values }))

                toast.add({ severity: 'success', summary: 'Account update Successfull!', detail: `Full name updated successfully to ${e.values.firstName} ${e.values.lastName}!`, life: 5000 })

                await userStore.setUser(user?.data)
                return
            } catch (err) {
                console.log(err)
                toast.add({ severity: 'error', summary: 'Account update Failed', detail: error.value, life: 5000 })
                return
            }
        } else {
            toast.add({ severity: 'error', summary: 'Account update Failed', detail: 'Please fix the errors in the form.', life: 5000 })
            return
        }
    }
</script>