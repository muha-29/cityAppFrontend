// Journey Analytics Service
const JourneyService = {
    // Save journey
    async saveJourney(journeyData) {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');

            const { data, error } = await supabase
                .from('journey_tracking')
                .insert([{
                    user_id: user.id,
                    start_point: `POINT(${journeyData.startLng} ${journeyData.startLat})`,
                    end_point: `POINT(${journeyData.endLng} ${journeyData.endLat})`,
                    route_distance: journeyData.distance,
                    route_duration: journeyData.duration,
                    potholes_encountered: journeyData.potholes,
                    average_speed: journeyData.avgSpeed,
                    tracking_points: journeyData.points,
                    shared_via: journeyData.sharedVia || []
                }])
                .select()
                .single();

            if (error) throw error;
            return { success: true, journey: data };
        } catch (error) {
            throw new Error(error.message || 'Failed to save journey');
        }
    },

    // Get user journeys
    async getUserJourneys(limit = 10) {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');

            const { data, error } = await supabase
                .from('journey_tracking')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(limit);

            if (error) throw error;
            return { success: true, journeys: data };
        } catch (error) {
            throw new Error(error.message || 'Failed to fetch journeys');
        }
    },

    // Get journey statistics
    async getJourneyStats(userId) {
        try {
            const { data, error } = await supabase
                .from('journey_tracking')
                .select('*')
                .eq('user_id', userId);

            if (error) throw error;

            const stats = {
                totalJourneys: data.length,
                totalDistance: data.reduce((sum, j) => sum + (j.route_distance || 0), 0),
                totalTime: data.reduce((sum, j) => sum + (j.route_duration || 0), 0),
                averageSpeed: data.length > 0 ? data.reduce((sum, j) => sum + (j.average_speed || 0), 0) / data.length : 0,
                totalPotholes: data.reduce((sum, j) => sum + (j.potholes_encountered || 0), 0),
                timesShared: data.filter(j => j.shared_via && j.shared_via.length > 0).length
            };

            return { success: true, stats };
        } catch (error) {
            throw new Error(error.message || 'Failed to fetch stats');
        }
    }
};