"use client"

import { useState, useEffect } from "react"

interface Department {
  id: string
  name: string
  cities: string[]
}

export function useColombiaLocations() {
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const res = await fetch("/data/colombia.json")
        if (!res.ok) throw new Error("Error al cargar departamentos")
        const data: Department[] = await res.json()
        if (!cancelled) setDepartments(data)
      } catch (err: any) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [])

  const departmentNames = departments.map((d) => d.name)

  const getCities = (departmentName: string): string[] => {
    const dept = departments.find((d) => d.name === departmentName)
    return dept?.cities || []
  }

  return { departments, departmentNames, getCities, loading, error }
}
