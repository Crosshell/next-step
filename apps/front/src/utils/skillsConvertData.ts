import { SkillData, SkillItem } from '@/types/profile';

export async function addMissingSkills(
  values: { skills: SkillData[]; newSkill: string },
  skillsList: SkillItem[] | null,
  addNewSkill: (skill: { name: string }) => Promise<any>,
  setRequestError: (error: string | null) => void
) {
  const notExistingSkills =
    skillsList &&
    values.skills.filter(
      (formSkill) =>
        !skillsList.some((available) => formSkill.skill.name === available.name)
    );

  if (notExistingSkills?.length) {
    for (const item of notExistingSkills) {
      const result = await addNewSkill({ name: item.skill.name });

      if (result.status === 'ok') {
        values.skills = values.skills.map((s) =>
          s.skill.name === item.skill.name ? { skill: result.data } : s
        );
      } else {
        setRequestError(result.error);
      }
    }
  }
}
