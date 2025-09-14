import { supabase } from '../lib/supabase';
import type { FreelancerProfile } from '../lib/supabase';
import { StepperFormValues } from '../hooks/hook-stepper';

export const freelancerProfileService = {
  async createProfile(formData: StepperFormValues, walletAddress: string) {
    const { data, error } = await supabase
      .from('freelancer_profiles')
      .insert([
        {
          wallet_address: walletAddress,
          title: formData.title,
          bio: formData.bio,
          profile_picture: formData.profile_picture,
          category: formData.category,
          specialities: formData.specialities,
          skills: formData.skills,
          english_fluency: formData.englishFluency,
          rate: formData.rate,
          date_of_birth: formData.date_of_birth,
          country: formData.country,
          address: formData.address,
          state: formData.state,
          city: formData.city,
          phone: formData.phone,
          zipcode: formData.zipcode,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getProfileByWalletAddress(walletAddress: string) {
    const { data, error } = await supabase
      .from('freelancer_profiles')
      .select('*')
      .eq('wallet_address', walletAddress)
      .single();

    if (error) throw error;
    return data as FreelancerProfile;
  },

  async updateProfile(id: string, formData: Partial<StepperFormValues>) {
    const { data, error } = await supabase
      .from('freelancer_profiles')
      .update({
        ...formData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async uploadProfilePicture(file: File, walletAddress: string) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${walletAddress}-${Math.random()}.${fileExt}`;
    const filePath = `profile-pictures/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('freelancer-profiles')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const {
      data: { publicUrl },
    } = supabase.storage.from('freelancer-profiles').getPublicUrl(filePath);

    return publicUrl;
  },
};
