import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/app/lib/supabaseAdmin';

export async function POST(request: Request) {
    try {
        const orderData = await request.json();

        if (!orderData || !orderData.items || !orderData.shipping_address) {
            return NextResponse.json({ error: 'Missing required order fields' }, { status: 400 });
        }

        if (!supabaseAdmin) {
            return NextResponse.json({ error: 'Database connection not configured' }, { status: 500 });
        }

        const newOrder = {
            user_id: orderData.user_id || null,
            status: orderData.status || 'pending',
            total_amount: orderData.total_amount,
            items: orderData.items,
            shipping_address: orderData.shipping_address,
            created_at: new Date().toISOString()
        };


        const { data, error } = await supabaseAdmin
            .from('orders')
            .insert(newOrder)
            .select()
            .single();

        if (error) {
            console.error('Error saving order to Supabase:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, order: data });
    } catch (error: any) {
        console.error('API /orders error:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: error.message },
            { status: 500 }
        );
    }
}
