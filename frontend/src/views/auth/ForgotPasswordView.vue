<template>
    <div class="flex justify-content-center align-items-center w-full h-full">
        <Toast />
        
        <Card class="w-24rem">
            <template #title>Forgot Password</template>

            <template #content>
                <Form v-slot="$form" :initialValues :resolver="formResolver" :validateOnBlur="true" @submit="onFormSubmit" class="flex flex-column gap-4 w-full sm:w-60">
                    <FormField v-slot="$field" name="email" initialValue="" class="flex flex-column gap-2">
                        <InputText type="text" placeholder="Enter email" fluid />
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{ $field.error?.message }}</Message>
                    </FormField>

                    <Button type="submit" label="Send" severity="secondary">
                        <Spinner v-if="loading" />
                    </Button>
                </Form>
            </template>
        </Card>
    </div>
</template>

<script setup lang="ts">
    import { ref } from 'vue'
    import { zodResolver } from '@primevue/forms/resolvers/zod'
    import { z } from 'zod'
    import type { FormSubmitEvent } from '@/types/Form.types'
    import { useToast } from 'primevue/usetoast'
    import { useApi } from '@/composables/useApi'
    import { useRouter } from 'vue-router'
    import { AuthService } from '@/services/AuthService'

    const router = useRouter()
    const { loading, error, execute } = useApi()
    const toast = useToast()

    const loginSchema = z.object({
        email: z.email({ error: 'Invalid email address.' })
            .min(1, { error: 'Email is required.' })
    })

    type ForgotPasswordFormValues = z.infer<typeof loginSchema>

    const initialValues = ref<ForgotPasswordFormValues>({
        email: '',
    })

    const formResolver = ref(zodResolver(loginSchema))

    // On form Submit
    const onFormSubmit = async ({ valid, values }: FormSubmitEvent) => {
        if (valid) {
            try {
                await execute(() => AuthService.forgotPassword(values))
                toast.add({ severity: 'success', summary: 'Sending Email Successful!', detail: 'Please check your email.', life: 5000 })
                router.replace({ name: 'login' })
                return
            } catch (err) {
                console.log(err)
                toast.add({ severity: 'error', summary: 'Sending Email Failed', detail: error.value, life: 5000 })
                return
            }
        } else {
            console.error('Validation failed.')
            toast.add({ severity: 'error', summary: 'Sending Email Failed', detail: 'Please fix the errors in the form.', life: 5000 })
            return
        }
    }
</script>