const API_URL = 'http://localhost:3001'

export const saveProject = async (project) => {
  try {
    const response = await fetch(`${API_URL}/api/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: project.name,
        type: project.type,
        folders: project.folders,
        statuses: project.statuses,
        docData: project.docData,
        labels: project.labels,
        userId: project.userId,
      }),
    })
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Failed to save project:', error)
    return null
  }
}

export const updateProject = async (projectId, project) => {
  try {
    const response = await fetch(`${API_URL}/api/projects/${projectId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: project.name,
        type: project.type,
        folders: project.folders,
        statuses: project.statuses,
        docData: project.docData,
        labels: project.labels,
      }),
    })
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Failed to update project:', error)
    return null
  }
}

export const getProjects = async () => {
  try {
    const response = await fetch(`${API_URL}/api/projects/temp-user`)
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Failed to fetch projects:', error)
    return []
  }
}

export const deleteProject = async (projectId) => {
  try {
    await fetch(`${API_URL}/api/projects/${projectId}`, {
      method: 'DELETE',
    })
    return true
  } catch (error) {
    console.error('Failed to delete project:', error)
    return false
  }
}

export const saveDocument = async (projectDbId, docId, content) => {
  try {
    const response = await fetch(`${API_URL}/api/projects/${projectDbId}/documents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ docId, content }),
    })
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Failed to save document:', error)
    return null
  }
}

export const getDocument = async (projectDbId, docId) => {
  try {
    const response = await fetch(`${API_URL}/api/projects/${projectDbId}/documents/${docId}`)
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Failed to fetch document:', error)
    return null
  }
}

export const getUserPlan = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/api/projects/user/${userId}/plan`)
    const data = await response.json()
    return data.plan
  } catch (error) {
    console.error('Failed to fetch user plan:', error)
    return 'free'
  }
}