import { useState, useCallback } from 'react'

interface UseFormReturn<T> {
  values: T
  errors: Partial<Record<keyof T, string>>
  touched: Partial<Record<keyof T, boolean>>
  setFieldValue: (field: keyof T, value: any) => void
  setFieldError: (field: keyof T, error: string) => void
  setFieldTouched: (field: keyof T, touched: boolean) => void
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  handleBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  resetForm: () => void
}

/**
 * Hook for managing form state
 */
export function useForm<T extends Record<string, any>>(
  initialValues: T,
  onSubmit?: (values: T) => void
): UseFormReturn<T> {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({})

  const setFieldValue = useCallback((field: keyof T, value: any) => {
    setValues((prev) => ({ ...prev, [field]: value }))
  }, [])

  const setFieldError = useCallback((field: keyof T, error: string) => {
    setErrors((prev) => ({ ...prev, [field]: error }))
  }, [])

  const setFieldTouched = useCallback((field: keyof T, isTouched: boolean) => {
    setTouched((prev) => ({ ...prev, [field]: isTouched }))
  }, [])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const fieldValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    setFieldValue(name as keyof T, fieldValue)
  }, [setFieldValue])

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target
    setFieldTouched(name as keyof T, true)
  }, [setFieldTouched])

  const resetForm = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
  }, [initialValues])

  return {
    values,
    errors,
    touched,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    handleChange,
    handleBlur,
    resetForm,
  }
}
