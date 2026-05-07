"use client";

import { translateProfile } from "@/lib/i18n";
import type { Profile } from "@/lib/types";
import { useLanguage } from "./language-provider";
import { PageHeading } from "./page-heading";

type ProfileHeadingProps = {
  profile: Profile;
};

export function ProfileHeading({ profile }: ProfileHeadingProps) {
  const { language, t } = useLanguage();
  const translatedProfile = translateProfile(profile, language);

  return (
    <PageHeading
      label={t("profile.label")}
      title={profile.displayName}
      description={translatedProfile.bio ?? t("profile.communityMember")}
    />
  );
}
