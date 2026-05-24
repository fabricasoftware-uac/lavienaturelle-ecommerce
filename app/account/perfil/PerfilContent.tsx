"use client"

import { ProfileSection } from "../components/ProfileSection"
import { SessionUser, updateProfileAction, changePasswordAction } from "./actions"

interface PerfilContentProps {
  user: SessionUser
}

export function PerfilContent({ user }: PerfilContentProps) {
  return (
    <ProfileSection
      user={user}
      onUpdate={updateProfileAction}
      onChangePassword={changePasswordAction}
    />
  )
}
