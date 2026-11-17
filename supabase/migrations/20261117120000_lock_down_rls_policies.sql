-- 2026-11-17 Supabase Auth 가입 악용 대응: RLS 정책 잠금 (#154)
-- 라이브 DB에는 이미 적용됨. 이력 관리용이며 재실행해도 같은 결과가 나오도록 작성.
-- 쓰기 소유자: dewdew (auth.users.id). 대시보드(postgres)·Edge Function(service role)은 RLS를 우회한다.

begin;

-- ---------------------------------------------------------------------------
-- 1) 공개 읽기 + 소유자 쓰기 (resume 11개, menu 4개, data.portfolio, archive 2개)
-- ---------------------------------------------------------------------------

-- resume.ai_settings
drop policy if exists "Allow authenticated insert" on resume.ai_settings;
drop policy if exists "Allow authenticated update" on resume.ai_settings;
drop policy if exists "Allow authenticated delete" on resume.ai_settings;
drop policy if exists "모든 조건 허용" on resume.ai_settings;
drop policy if exists "All Access" on resume.ai_settings;
drop policy if exists "Allow public read access" on resume.ai_settings;
drop policy if exists "Owner insert" on resume.ai_settings;
drop policy if exists "Owner update" on resume.ai_settings;
drop policy if exists "Owner delete" on resume.ai_settings;
create policy "Allow public read access" on resume.ai_settings for select to public using (true);
create policy "Owner insert" on resume.ai_settings for insert to authenticated with check ((select auth.uid()) = '212c362f-968a-4ae9-b0cf-f858ef6766a2'::uuid);
create policy "Owner update" on resume.ai_settings for update to authenticated using ((select auth.uid()) = '212c362f-968a-4ae9-b0cf-f858ef6766a2'::uuid) with check ((select auth.uid()) = '212c362f-968a-4ae9-b0cf-f858ef6766a2'::uuid);
create policy "Owner delete" on resume.ai_settings for delete to authenticated using ((select auth.uid()) = '212c362f-968a-4ae9-b0cf-f858ef6766a2'::uuid);

-- resume.certifications
drop policy if exists "Allow authenticated insert" on resume.certifications;
drop policy if exists "Allow authenticated update" on resume.certifications;
drop policy if exists "Allow authenticated delete" on resume.certifications;
drop policy if exists "모든 조건 허용" on resume.certifications;
drop policy if exists "All Access" on resume.certifications;
drop policy if exists "Allow public read access" on resume.certifications;
drop policy if exists "Owner insert" on resume.certifications;
drop policy if exists "Owner update" on resume.certifications;
drop policy if exists "Owner delete" on resume.certifications;
create policy "Allow public read access" on resume.certifications for select to public using (true);
create policy "Owner insert" on resume.certifications for insert to authenticated with check ((select auth.uid()) = '212c362f-968a-4ae9-b0cf-f858ef6766a2'::uuid);
create policy "Owner update" on resume.certifications for update to authenticated using ((select auth.uid()) = '212c362f-968a-4ae9-b0cf-f858ef6766a2'::uuid) with check ((select auth.uid()) = '212c362f-968a-4ae9-b0cf-f858ef6766a2'::uuid);
create policy "Owner delete" on resume.certifications for delete to authenticated using ((select auth.uid()) = '212c362f-968a-4ae9-b0cf-f858ef6766a2'::uuid);

-- resume.education
drop policy if exists "Allow authenticated insert" on resume.education;
drop policy if exists "Allow authenticated update" on resume.education;
drop policy if exists "Allow authenticated delete" on resume.education;
drop policy if exists "모든 조건 허용" on resume.education;
drop policy if exists "All Access" on resume.education;
drop policy if exists "Allow public read access" on resume.education;
drop policy if exists "Owner insert" on resume.education;
drop policy if exists "Owner update" on resume.education;
drop policy if exists "Owner delete" on resume.education;
create policy "Allow public read access" on resume.education for select to public using (true);
create policy "Owner insert" on resume.education for insert to authenticated with check ((select auth.uid()) = '212c362f-968a-4ae9-b0cf-f858ef6766a2'::uuid);
create policy "Owner update" on resume.education for update to authenticated using ((select auth.uid()) = '212c362f-968a-4ae9-b0cf-f858ef6766a2'::uuid) with check ((select auth.uid()) = '212c362f-968a-4ae9-b0cf-f858ef6766a2'::uuid);
create policy "Owner delete" on resume.education for delete to authenticated using ((select auth.uid()) = '212c362f-968a-4ae9-b0cf-f858ef6766a2'::uuid);

-- resume.experience
drop policy if exists "Allow authenticated insert" on resume.experience;
drop policy if exists "Allow authenticated update" on resume.experience;
drop policy if exists "Allow authenticated delete" on resume.experience;
drop policy if exists "모든 조건 허용" on resume.experience;
drop policy if exists "All Access" on resume.experience;
drop policy if exists "Allow public read access" on resume.experience;
drop policy if exists "Owner insert" on resume.experience;
drop policy if exists "Owner update" on resume.experience;
drop policy if exists "Owner delete" on resume.experience;
create policy "Allow public read access" on resume.experience for select to public using (true);
create policy "Owner insert" on resume.experience for insert to authenticated with check ((select auth.uid()) = '212c362f-968a-4ae9-b0cf-f858ef6766a2'::uuid);
create policy "Owner update" on resume.experience for update to authenticated using ((select auth.uid()) = '212c362f-968a-4ae9-b0cf-f858ef6766a2'::uuid) with check ((select auth.uid()) = '212c362f-968a-4ae9-b0cf-f858ef6766a2'::uuid);
create policy "Owner delete" on resume.experience for delete to authenticated using ((select auth.uid()) = '212c362f-968a-4ae9-b0cf-f858ef6766a2'::uuid);

-- resume.hobbies
drop policy if exists "Allow authenticated insert" on resume.hobbies;
drop policy if exists "Allow authenticated update" on resume.hobbies;
drop policy if exists "Allow authenticated delete" on resume.hobbies;
drop policy if exists "모든 조건 허용" on resume.hobbies;
drop policy if exists "All Access" on resume.hobbies;
drop policy if exists "Allow public read access" on resume.hobbies;
drop policy if exists "Owner insert" on resume.hobbies;
drop policy if exists "Owner update" on resume.hobbies;
drop policy if exists "Owner delete" on resume.hobbies;
create policy "Allow public read access" on resume.hobbies for select to public using (true);
create policy "Owner insert" on resume.hobbies for insert to authenticated with check ((select auth.uid()) = '212c362f-968a-4ae9-b0cf-f858ef6766a2'::uuid);
create policy "Owner update" on resume.hobbies for update to authenticated using ((select auth.uid()) = '212c362f-968a-4ae9-b0cf-f858ef6766a2'::uuid) with check ((select auth.uid()) = '212c362f-968a-4ae9-b0cf-f858ef6766a2'::uuid);
create policy "Owner delete" on resume.hobbies for delete to authenticated using ((select auth.uid()) = '212c362f-968a-4ae9-b0cf-f858ef6766a2'::uuid);

-- resume.image_archive
drop policy if exists "Allow authenticated insert" on resume.image_archive;
drop policy if exists "Allow authenticated update" on resume.image_archive;
drop policy if exists "Allow authenticated delete" on resume.image_archive;
drop policy if exists "모든 조건 허용" on resume.image_archive;
drop policy if exists "All Access" on resume.image_archive;
drop policy if exists "Allow public read access" on resume.image_archive;
drop policy if exists "Owner insert" on resume.image_archive;
drop policy if exists "Owner update" on resume.image_archive;
drop policy if exists "Owner delete" on resume.image_archive;
create policy "Allow public read access" on resume.image_archive for select to public using (true);
create policy "Owner insert" on resume.image_archive for insert to authenticated with check ((select auth.uid()) = '212c362f-968a-4ae9-b0cf-f858ef6766a2'::uuid);
create policy "Owner update" on resume.image_archive for update to authenticated using ((select auth.uid()) = '212c362f-968a-4ae9-b0cf-f858ef6766a2'::uuid) with check ((select auth.uid()) = '212c362f-968a-4ae9-b0cf-f858ef6766a2'::uuid);
create policy "Owner delete" on resume.image_archive for delete to authenticated using ((select auth.uid()) = '212c362f-968a-4ae9-b0cf-f858ef6766a2'::uuid);

-- resume.profile
drop policy if exists "Allow authenticated insert" on resume.profile;
drop policy if exists "Allow authenticated update" on resume.profile;
drop policy if exists "Allow authenticated delete" on resume.profile;
drop policy if exists "모든 조건 허용" on resume.profile;
drop policy if exists "All Access" on resume.profile;
drop policy if exists "Allow public read access" on resume.profile;
drop policy if exists "Owner insert" on resume.profile;
drop policy if exists "Owner update" on resume.profile;
drop policy if exists "Owner delete" on resume.profile;
create policy "Allow public read access" on resume.profile for select to public using (true);
create policy "Owner insert" on resume.profile for insert to authenticated with check ((select auth.uid()) = '212c362f-968a-4ae9-b0cf-f858ef6766a2'::uuid);
create policy "Owner update" on resume.profile for update to authenticated using ((select auth.uid()) = '212c362f-968a-4ae9-b0cf-f858ef6766a2'::uuid) with check ((select auth.uid()) = '212c362f-968a-4ae9-b0cf-f858ef6766a2'::uuid);
create policy "Owner delete" on resume.profile for delete to authenticated using ((select auth.uid()) = '212c362f-968a-4ae9-b0cf-f858ef6766a2'::uuid);

-- resume.projects
drop policy if exists "Allow authenticated insert" on resume.projects;
drop policy if exists "Allow authenticated update" on resume.projects;
drop policy if exists "Allow authenticated delete" on resume.projects;
drop policy if exists "모든 조건 허용" on resume.projects;
drop policy if exists "All Access" on resume.projects;
drop policy if exists "Allow public read access" on resume.projects;
drop policy if exists "Owner insert" on resume.projects;
drop policy if exists "Owner update" on resume.projects;
drop policy if exists "Owner delete" on resume.projects;
create policy "Allow public read access" on resume.projects for select to public using (true);
create policy "Owner insert" on resume.projects for insert to authenticated with check ((select auth.uid()) = '212c362f-968a-4ae9-b0cf-f858ef6766a2'::uuid);
create policy "Owner update" on resume.projects for update to authenticated using ((select auth.uid()) = '212c362f-968a-4ae9-b0cf-f858ef6766a2'::uuid) with check ((select auth.uid()) = '212c362f-968a-4ae9-b0cf-f858ef6766a2'::uuid);
create policy "Owner delete" on resume.projects for delete to authenticated using ((select auth.uid()) = '212c362f-968a-4ae9-b0cf-f858ef6766a2'::uuid);

-- resume.skills
drop policy if exists "Allow authenticated insert" on resume.skills;
drop policy if exists "Allow authenticated update" on resume.skills;
drop policy if exists "Allow authenticated delete" on resume.skills;
drop policy if exists "모든 조건 허용" on resume.skills;
drop policy if exists "All Access" on resume.skills;
drop policy if exists "Allow public read access" on resume.skills;
drop policy if exists "Owner insert" on resume.skills;
drop policy if exists "Owner update" on resume.skills;
drop policy if exists "Owner delete" on resume.skills;
create policy "Allow public read access" on resume.skills for select to public using (true);
create policy "Owner insert" on resume.skills for insert to authenticated with check ((select auth.uid()) = '212c362f-968a-4ae9-b0cf-f858ef6766a2'::uuid);
create policy "Owner update" on resume.skills for update to authenticated using ((select auth.uid()) = '212c362f-968a-4ae9-b0cf-f858ef6766a2'::uuid) with check ((select auth.uid()) = '212c362f-968a-4ae9-b0cf-f858ef6766a2'::uuid);
create policy "Owner delete" on resume.skills for delete to authenticated using ((select auth.uid()) = '212c362f-968a-4ae9-b0cf-f858ef6766a2'::uuid);

-- resume.social_links
drop policy if exists "Allow authenticated insert" on resume.social_links;
drop policy if exists "Allow authenticated update" on resume.social_links;
drop policy if exists "Allow authenticated delete" on resume.social_links;
drop policy if exists "모든 조건 허용" on resume.social_links;
drop policy if exists "All Access" on resume.social_links;
drop policy if exists "Allow public read access" on resume.social_links;
drop policy if exists "Owner insert" on resume.social_links;
drop policy if exists "Owner update" on resume.social_links;
drop policy if exists "Owner delete" on resume.social_links;
create policy "Allow public read access" on resume.social_links for select to public using (true);
create policy "Owner insert" on resume.social_links for insert to authenticated with check ((select auth.uid()) = '212c362f-968a-4ae9-b0cf-f858ef6766a2'::uuid);
create policy "Owner update" on resume.social_links for update to authenticated using ((select auth.uid()) = '212c362f-968a-4ae9-b0cf-f858ef6766a2'::uuid) with check ((select auth.uid()) = '212c362f-968a-4ae9-b0cf-f858ef6766a2'::uuid);
create policy "Owner delete" on resume.social_links for delete to authenticated using ((select auth.uid()) = '212c362f-968a-4ae9-b0cf-f858ef6766a2'::uuid);

-- resume.threejs
drop policy if exists "Allow authenticated insert" on resume.threejs;
drop policy if exists "Allow authenticated update" on resume.threejs;
drop policy if exists "Allow authenticated delete" on resume.threejs;
drop policy if exists "모든 조건 허용" on resume.threejs;
drop policy if exists "All Access" on resume.threejs;
drop policy if exists "Allow public read access" on resume.threejs;
drop policy if exists "Owner insert" on resume.threejs;
drop policy if exists "Owner update" on resume.threejs;
drop policy if exists "Owner delete" on resume.threejs;
create policy "Allow public read access" on resume.threejs for select to public using (true);
create policy "Owner insert" on resume.threejs for insert to authenticated with check ((select auth.uid()) = '212c362f-968a-4ae9-b0cf-f858ef6766a2'::uuid);
create policy "Owner update" on resume.threejs for update to authenticated using ((select auth.uid()) = '212c362f-968a-4ae9-b0cf-f858ef6766a2'::uuid) with check ((select auth.uid()) = '212c362f-968a-4ae9-b0cf-f858ef6766a2'::uuid);
create policy "Owner delete" on resume.threejs for delete to authenticated using ((select auth.uid()) = '212c362f-968a-4ae9-b0cf-f858ef6766a2'::uuid);

-- data.portfolio
drop policy if exists "Allow authenticated insert" on data.portfolio;
drop policy if exists "Allow authenticated update" on data.portfolio;
drop policy if exists "Allow authenticated delete" on data.portfolio;
drop policy if exists "모든 조건 허용" on data.portfolio;
drop policy if exists "All Access" on data.portfolio;
drop policy if exists "Allow public read access" on data.portfolio;
drop policy if exists "Owner insert" on data.portfolio;
drop policy if exists "Owner update" on data.portfolio;
drop policy if exists "Owner delete" on data.portfolio;
create policy "Allow public read access" on data.portfolio for select to public using (true);
create policy "Owner insert" on data.portfolio for insert to authenticated with check ((select auth.uid()) = '212c362f-968a-4ae9-b0cf-f858ef6766a2'::uuid);
create policy "Owner update" on data.portfolio for update to authenticated using ((select auth.uid()) = '212c362f-968a-4ae9-b0cf-f858ef6766a2'::uuid) with check ((select auth.uid()) = '212c362f-968a-4ae9-b0cf-f858ef6766a2'::uuid);
create policy "Owner delete" on data.portfolio for delete to authenticated using ((select auth.uid()) = '212c362f-968a-4ae9-b0cf-f858ef6766a2'::uuid);

-- menu."externalMenu"
drop policy if exists "Allow authenticated insert" on menu."externalMenu";
drop policy if exists "Allow authenticated update" on menu."externalMenu";
drop policy if exists "Allow authenticated delete" on menu."externalMenu";
drop policy if exists "모든 조건 허용" on menu."externalMenu";
drop policy if exists "All Access" on menu."externalMenu";
drop policy if exists "Allow public read access" on menu."externalMenu";
drop policy if exists "Owner insert" on menu."externalMenu";
drop policy if exists "Owner update" on menu."externalMenu";
drop policy if exists "Owner delete" on menu."externalMenu";
create policy "Allow public read access" on menu."externalMenu" for select to public using (true);
create policy "Owner insert" on menu."externalMenu" for insert to authenticated with check ((select auth.uid()) = '212c362f-968a-4ae9-b0cf-f858ef6766a2'::uuid);
create policy "Owner update" on menu."externalMenu" for update to authenticated using ((select auth.uid()) = '212c362f-968a-4ae9-b0cf-f858ef6766a2'::uuid) with check ((select auth.uid()) = '212c362f-968a-4ae9-b0cf-f858ef6766a2'::uuid);
create policy "Owner delete" on menu."externalMenu" for delete to authenticated using ((select auth.uid()) = '212c362f-968a-4ae9-b0cf-f858ef6766a2'::uuid);

-- menu."menuCategory"
drop policy if exists "Allow authenticated insert" on menu."menuCategory";
drop policy if exists "Allow authenticated update" on menu."menuCategory";
drop policy if exists "Allow authenticated delete" on menu."menuCategory";
drop policy if exists "모든 조건 허용" on menu."menuCategory";
drop policy if exists "All Access" on menu."menuCategory";
drop policy if exists "Allow public read access" on menu."menuCategory";
drop policy if exists "Owner insert" on menu."menuCategory";
drop policy if exists "Owner update" on menu."menuCategory";
drop policy if exists "Owner delete" on menu."menuCategory";
create policy "Allow public read access" on menu."menuCategory" for select to public using (true);
create policy "Owner insert" on menu."menuCategory" for insert to authenticated with check ((select auth.uid()) = '212c362f-968a-4ae9-b0cf-f858ef6766a2'::uuid);
create policy "Owner update" on menu."menuCategory" for update to authenticated using ((select auth.uid()) = '212c362f-968a-4ae9-b0cf-f858ef6766a2'::uuid) with check ((select auth.uid()) = '212c362f-968a-4ae9-b0cf-f858ef6766a2'::uuid);
create policy "Owner delete" on menu."menuCategory" for delete to authenticated using ((select auth.uid()) = '212c362f-968a-4ae9-b0cf-f858ef6766a2'::uuid);

-- menu."showcaseMenu"
drop policy if exists "Allow authenticated insert" on menu."showcaseMenu";
drop policy if exists "Allow authenticated update" on menu."showcaseMenu";
drop policy if exists "Allow authenticated delete" on menu."showcaseMenu";
drop policy if exists "모든 조건 허용" on menu."showcaseMenu";
drop policy if exists "All Access" on menu."showcaseMenu";
drop policy if exists "Allow public read access" on menu."showcaseMenu";
drop policy if exists "Owner insert" on menu."showcaseMenu";
drop policy if exists "Owner update" on menu."showcaseMenu";
drop policy if exists "Owner delete" on menu."showcaseMenu";
create policy "Allow public read access" on menu."showcaseMenu" for select to public using (true);
create policy "Owner insert" on menu."showcaseMenu" for insert to authenticated with check ((select auth.uid()) = '212c362f-968a-4ae9-b0cf-f858ef6766a2'::uuid);
create policy "Owner update" on menu."showcaseMenu" for update to authenticated using ((select auth.uid()) = '212c362f-968a-4ae9-b0cf-f858ef6766a2'::uuid) with check ((select auth.uid()) = '212c362f-968a-4ae9-b0cf-f858ef6766a2'::uuid);
create policy "Owner delete" on menu."showcaseMenu" for delete to authenticated using ((select auth.uid()) = '212c362f-968a-4ae9-b0cf-f858ef6766a2'::uuid);

-- menu."subMenu"
drop policy if exists "Allow authenticated insert" on menu."subMenu";
drop policy if exists "Allow authenticated update" on menu."subMenu";
drop policy if exists "Allow authenticated delete" on menu."subMenu";
drop policy if exists "모든 조건 허용" on menu."subMenu";
drop policy if exists "All Access" on menu."subMenu";
drop policy if exists "Allow public read access" on menu."subMenu";
drop policy if exists "Owner insert" on menu."subMenu";
drop policy if exists "Owner update" on menu."subMenu";
drop policy if exists "Owner delete" on menu."subMenu";
create policy "Allow public read access" on menu."subMenu" for select to public using (true);
create policy "Owner insert" on menu."subMenu" for insert to authenticated with check ((select auth.uid()) = '212c362f-968a-4ae9-b0cf-f858ef6766a2'::uuid);
create policy "Owner update" on menu."subMenu" for update to authenticated using ((select auth.uid()) = '212c362f-968a-4ae9-b0cf-f858ef6766a2'::uuid) with check ((select auth.uid()) = '212c362f-968a-4ae9-b0cf-f858ef6766a2'::uuid);
create policy "Owner delete" on menu."subMenu" for delete to authenticated using ((select auth.uid()) = '212c362f-968a-4ae9-b0cf-f858ef6766a2'::uuid);

-- public."archiveCategory"
drop policy if exists "Allow authenticated insert" on public."archiveCategory";
drop policy if exists "Allow authenticated update" on public."archiveCategory";
drop policy if exists "Allow authenticated delete" on public."archiveCategory";
drop policy if exists "모든 조건 허용" on public."archiveCategory";
drop policy if exists "All Access" on public."archiveCategory";
drop policy if exists "Allow public read access" on public."archiveCategory";
drop policy if exists "Owner insert" on public."archiveCategory";
drop policy if exists "Owner update" on public."archiveCategory";
drop policy if exists "Owner delete" on public."archiveCategory";
create policy "Allow public read access" on public."archiveCategory" for select to public using (true);
create policy "Owner insert" on public."archiveCategory" for insert to authenticated with check ((select auth.uid()) = '212c362f-968a-4ae9-b0cf-f858ef6766a2'::uuid);
create policy "Owner update" on public."archiveCategory" for update to authenticated using ((select auth.uid()) = '212c362f-968a-4ae9-b0cf-f858ef6766a2'::uuid) with check ((select auth.uid()) = '212c362f-968a-4ae9-b0cf-f858ef6766a2'::uuid);
create policy "Owner delete" on public."archiveCategory" for delete to authenticated using ((select auth.uid()) = '212c362f-968a-4ae9-b0cf-f858ef6766a2'::uuid);

-- public."archiveList"
drop policy if exists "Allow authenticated insert" on public."archiveList";
drop policy if exists "Allow authenticated update" on public."archiveList";
drop policy if exists "Allow authenticated delete" on public."archiveList";
drop policy if exists "모든 조건 허용" on public."archiveList";
drop policy if exists "All Access" on public."archiveList";
drop policy if exists "Allow public read access" on public."archiveList";
drop policy if exists "Owner insert" on public."archiveList";
drop policy if exists "Owner update" on public."archiveList";
drop policy if exists "Owner delete" on public."archiveList";
create policy "Allow public read access" on public."archiveList" for select to public using (true);
create policy "Owner insert" on public."archiveList" for insert to authenticated with check ((select auth.uid()) = '212c362f-968a-4ae9-b0cf-f858ef6766a2'::uuid);
create policy "Owner update" on public."archiveList" for update to authenticated using ((select auth.uid()) = '212c362f-968a-4ae9-b0cf-f858ef6766a2'::uuid) with check ((select auth.uid()) = '212c362f-968a-4ae9-b0cf-f858ef6766a2'::uuid);
create policy "Owner delete" on public."archiveList" for delete to authenticated using ((select auth.uid()) = '212c362f-968a-4ae9-b0cf-f858ef6766a2'::uuid);

-- ---------------------------------------------------------------------------
-- 2) resume.chat_history: 방문자는 저장만 가능 (조회·수정·삭제 불가)
-- ---------------------------------------------------------------------------
drop policy if exists "All Access" on resume.chat_history;
drop policy if exists "Public insert only" on resume.chat_history;
create policy "Public insert only" on resume.chat_history for insert to anon, authenticated with check (true);

-- ---------------------------------------------------------------------------
-- 3) resume.document_embeddings: 공개 조회만, 쓰기는 service role(Edge Function)만
-- ---------------------------------------------------------------------------
drop policy if exists "All Access" on resume.document_embeddings;
drop policy if exists "Allow public read access" on resume.document_embeddings;
create policy "Allow public read access" on resume.document_embeddings for select to public using (true);

commit;
