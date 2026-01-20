// Supabase Configuration
const SUPABASE_URL = 'https://edppzcfcqeuejmexsmgf.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_IVLOVjZYuAbVMWPhG-FxoA_Yr_eMZdt';

// Initialize Supabase Client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ========================================
// Invitations CRUD Operations
// ========================================

async function getInvitations() {
    const { data, error } = await supabase
        .from('invitations')
        .select('*')
        .order('wedding_date', { ascending: true });

    if (error) {
        console.error('Error fetching invitations:', error);
        return [];
    }
    return data;
}

async function getUpcomingInvitations() {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
        .from('invitations')
        .select('*')
        .gte('wedding_date', today)
        .order('wedding_date', { ascending: true });

    if (error) {
        console.error('Error fetching upcoming invitations:', error);
        return [];
    }
    return data;
}

async function getInvitationById(id) {
    const { data, error } = await supabase
        .from('invitations')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching invitation:', error);
        return null;
    }
    return data;
}

async function createInvitation(invitation) {
    const { data, error } = await supabase
        .from('invitations')
        .insert([invitation])
        .select()
        .single();

    if (error) {
        console.error('Error creating invitation:', error);
        throw error;
    }
    return data;
}

async function updateInvitation(id, updates) {
    const { data, error } = await supabase
        .from('invitations')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating invitation:', error);
        throw error;
    }
    return data;
}

async function deleteInvitation(id) {
    const { error } = await supabase
        .from('invitations')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting invitation:', error);
        throw error;
    }
    return true;
}

// ========================================
// News CRUD Operations
// ========================================

async function getNews() {
    const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching news:', error);
        return [];
    }
    return data;
}

async function getNewsById(id) {
    const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching news item:', error);
        return null;
    }
    return data;
}

async function createNews(newsItem) {
    const { data, error } = await supabase
        .from('news')
        .insert([newsItem])
        .select()
        .single();

    if (error) {
        console.error('Error creating news:', error);
        throw error;
    }
    return data;
}

async function updateNews(id, updates) {
    const { data, error } = await supabase
        .from('news')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating news:', error);
        throw error;
    }
    return data;
}

async function deleteNews(id) {
    const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting news:', error);
        throw error;
    }
    return true;
}

// ========================================
// Authentication
// ========================================

async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (error) {
        console.error('Error signing in:', error);
        throw error;
    }
    return data;
}

async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error('Error signing out:', error);
        throw error;
    }
    return true;
}

async function getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
        console.error('Error getting session:', error);
        return null;
    }
    return session;
}

async function isAuthenticated() {
    const session = await getSession();
    return session !== null;
}

// Listen for auth state changes
supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN') {
        console.log('User signed in:', session.user.email);
    } else if (event === 'SIGNED_OUT') {
        console.log('User signed out');
    }
});
